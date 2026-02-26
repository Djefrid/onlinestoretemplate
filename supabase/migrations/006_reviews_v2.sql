-- Migration: 006_reviews_v2
-- Étend la table reviews pour supporter les invités, la modération et l'anti-spam.
-- À coller dans Supabase SQL Editor.

-- ─────────────────────────────────────────────────────────────────
-- 1. Rendre user_id nullable (invités sans compte)
-- ─────────────────────────────────────────────────────────────────
ALTER TABLE public.reviews ALTER COLUMN user_id DROP NOT NULL;

-- Changer la FK de CASCADE → SET NULL (user supprimé → conserver l'avis anonymisé)
ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;
ALTER TABLE public.reviews
  ADD CONSTRAINT reviews_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- ─────────────────────────────────────────────────────────────────
-- 2. Supprimer la contrainte UNIQUE(user_id, product_slug)
--    (les invités n'ont pas user_id, impossible d'unicifier sur null)
-- ─────────────────────────────────────────────────────────────────
ALTER TABLE public.reviews
  DROP CONSTRAINT IF EXISTS reviews_user_id_product_slug_key;

-- ─────────────────────────────────────────────────────────────────
-- 3. Nouvelles colonnes
-- ─────────────────────────────────────────────────────────────────
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS author_name     TEXT,        -- nullable pour compat anciens avis
  ADD COLUMN IF NOT EXISTS author_email    TEXT,
  ADD COLUMN IF NOT EXISTS status          TEXT         NOT NULL DEFAULT 'approved'
                                            CHECK (status IN ('approved', 'hidden')),
  ADD COLUMN IF NOT EXISTS is_deleted      BOOLEAN      NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS admin_reply     TEXT,
  ADD COLUMN IF NOT EXISTS ip_hash         TEXT,
  ADD COLUMN IF NOT EXISTS user_agent_hash TEXT,
  ADD COLUMN IF NOT EXISTS updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now();

-- ─────────────────────────────────────────────────────────────────
-- 4. Trigger updated_at
-- ─────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_reviews_updated_at ON public.reviews;
CREATE TRIGGER trg_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─────────────────────────────────────────────────────────────────
-- 5. Index pour les requêtes fréquentes
-- ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_reviews_product_slug ON public.reviews(product_slug);
CREATE INDEX IF NOT EXISTS idx_reviews_status       ON public.reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at   ON public.reviews(created_at DESC);

-- Anti-spam : recherche rapide par (ip_hash, product_slug, created_at)
CREATE INDEX IF NOT EXISTS idx_reviews_ip_spam
  ON public.reviews(ip_hash, product_slug, created_at DESC)
  WHERE ip_hash IS NOT NULL;

-- ─────────────────────────────────────────────────────────────────
-- 6. RLS : remplacer les anciennes policies
-- ─────────────────────────────────────────────────────────────────
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes policies
DROP POLICY IF EXISTS "Anyone can read reviews"     ON public.reviews;
DROP POLICY IF EXISTS "Users can create own review" ON public.reviews;
DROP POLICY IF EXISTS "Users can update own review" ON public.reviews;
DROP POLICY IF EXISTS "Users can delete own review" ON public.reviews;
-- Supprimer si existaient déjà des nouvelles
DROP POLICY IF EXISTS "reviews_public_read"         ON public.reviews;
DROP POLICY IF EXISTS "reviews_admin_read_all"      ON public.reviews;
DROP POLICY IF EXISTS "reviews_admin_update"        ON public.reviews;
DROP POLICY IF EXISTS "reviews_admin_delete"        ON public.reviews;

-- Lecture publique : uniquement approved + not deleted
CREATE POLICY "reviews_public_read"
  ON public.reviews FOR SELECT
  USING (status = 'approved' AND is_deleted = false);

-- Lecture admin : tout voir (y compris hidden/deleted)
CREATE POLICY "reviews_admin_read_all"
  ON public.reviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Update admin : masquer/réafficher/répondre
CREATE POLICY "reviews_admin_update"
  ON public.reviews FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Remarque : les inserts sont effectués via createServiceClient() côté serveur
-- (API route /api/reviews) et contournent donc RLS.
-- Aucune policy INSERT n'est requise.
