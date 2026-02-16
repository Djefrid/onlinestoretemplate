-- ══════════════════════════════════════════════════════
-- Migration 006: Correctifs de sécurité
-- ══════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────
-- FIX 1: Empêcher les utilisateurs de modifier leur propre rôle
-- AVANT: Un utilisateur pouvait faire UPDATE profiles SET role = 'admin'
-- APRÈS: Le rôle ne peut pas être changé par l'utilisateur lui-même
-- ─────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM profiles WHERE id = auth.uid())
  );

-- ─────────────────────────────────────────────────────
-- FIX 2: Révoquer l'accès public à increment_loyalty
-- AVANT: N'importe quel utilisateur authentifié pouvait s'ajouter des points
-- APRÈS: Seul le service_role (webhook Stripe) peut appeler cette fonction
-- ─────────────────────────────────────────────────────

REVOKE EXECUTE ON FUNCTION increment_loyalty FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION increment_loyalty FROM authenticated;
REVOKE EXECUTE ON FUNCTION increment_loyalty FROM anon;

-- ─────────────────────────────────────────────────────
-- FIX 3: Ajouter search_path aux fonctions SECURITY DEFINER
-- Prévient les attaques par manipulation du search_path
-- ─────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION increment_loyalty(user_id_input UUID, points_input INT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET loyalty_points = loyalty_points + points_input
  WHERE id = user_id_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
