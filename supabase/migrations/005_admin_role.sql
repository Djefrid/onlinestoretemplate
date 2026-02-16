-- ══════════════════════════════════════════════════════
-- Migration 005: Ajout du rôle admin à la table profiles
-- ══════════════════════════════════════════════════════

-- 1) Ajouter la colonne "role" avec valeur par défaut 'customer'
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'customer';

-- 2) Contrainte : seules les valeurs 'admin' et 'customer' sont permises
ALTER TABLE profiles
  ADD CONSTRAINT profiles_role_check CHECK (role IN ('admin', 'customer'));

-- 3) Index pour les requêtes par rôle (utile pour lister les admins)
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles (role);

-- ══════════════════════════════════════════════════════
-- Pour promouvoir un utilisateur en admin :
--
--   UPDATE profiles SET role = 'admin' WHERE id = '<USER_UUID>';
--
-- Pour trouver le UUID d'un utilisateur par email :
--
--   SELECT id FROM auth.users WHERE email = 'admin@example.com';
--
-- Donc en une seule requête :
--
--   UPDATE profiles SET role = 'admin'
--   WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');
--
-- ══════════════════════════════════════════════════════
