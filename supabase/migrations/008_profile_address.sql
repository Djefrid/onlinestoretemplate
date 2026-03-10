-- ── Migration 008 : champs adresse sur profiles ──────────────────────────────
-- Ajoute les colonnes d'adresse par défaut pour le pré-remplissage du checkout.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS address_line1  TEXT,
  ADD COLUMN IF NOT EXISTS address_line2  TEXT,
  ADD COLUMN IF NOT EXISTS city           TEXT,
  ADD COLUMN IF NOT EXISTS postal_code    TEXT,
  ADD COLUMN IF NOT EXISTS province       TEXT DEFAULT 'QC';
