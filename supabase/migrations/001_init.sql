-- ═══════════════════════════════════════════════════
-- Épicerie Africaine — Tables principales
-- ═══════════════════════════════════════════════════

-- Types ENUM
CREATE TYPE order_status AS ENUM ('pending','paid','shipped','delivered','cancelled','refunded');
CREATE TYPE delivery_mode AS ENUM ('delivery','pickup');
CREATE TYPE cart_status AS ENUM ('active','converted');

-- ── profiles ──────────────────────────────────────
CREATE TABLE profiles (
  id             UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name      TEXT,
  phone          TEXT,
  loyalty_points INT DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT now()
);

-- Trigger: auto-créer profil au signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── carts ─────────────────────────────────────────
CREATE TABLE carts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status     cart_status DEFAULT 'active',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── cart_items ────────────────────────────────────
CREATE TABLE cart_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id      UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_slug TEXT NOT NULL,
  name         TEXT NOT NULL,
  price_cents  INT NOT NULL,
  quantity     INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  image_url    TEXT
);

-- ── orders ────────────────────────────────────────
CREATE TABLE orders (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  stripe_session_id  TEXT UNIQUE NOT NULL,
  payment_intent_id  TEXT,
  status             order_status DEFAULT 'pending',
  delivery_mode      delivery_mode NOT NULL,
  customer_email     TEXT NOT NULL,
  customer_name      TEXT NOT NULL,
  phone              TEXT,
  address            JSONB,
  pickup_slot        TEXT,
  subtotal_cents     INT NOT NULL,
  shipping_cents     INT NOT NULL DEFAULT 0,
  total_cents        INT NOT NULL,
  created_at         TIMESTAMPTZ DEFAULT now()
);

-- ── order_items ───────────────────────────────────
CREATE TABLE order_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_slug TEXT NOT NULL,
  name         TEXT NOT NULL,
  price_cents  INT NOT NULL,
  quantity     INT NOT NULL DEFAULT 1
);

-- ── reviews ───────────────────────────────────────
CREATE TABLE reviews (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_slug TEXT NOT NULL,
  rating       INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment      TEXT,
  is_verified  BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, product_slug)
);
