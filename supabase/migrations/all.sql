-- ═══════════════════════════════════════════════════════════════
-- Épicerie Africaine — Script SQL complet (toutes les migrations)
-- Coller ce fichier dans Supabase > SQL Editor > New Query > Run
-- ═══════════════════════════════════════════════════════════════


-- ═══════════════════════════════════════════════════
-- 1/4 — Tables principales
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


-- ═══════════════════════════════════════════════════
-- 2/4 — Row Level Security (RLS)
-- ═══════════════════════════════════════════════════

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- ── profiles ──────────────────────────────────────
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- ── carts ─────────────────────────────────────────
CREATE POLICY "Users can view own carts"
  ON carts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own carts"
  ON carts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own carts"
  ON carts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own carts"
  ON carts FOR DELETE USING (auth.uid() = user_id);

-- ── cart_items ────────────────────────────────────
CREATE POLICY "Users can view own cart items"
  ON cart_items FOR SELECT USING (
    cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid())
  );
CREATE POLICY "Users can insert own cart items"
  ON cart_items FOR INSERT WITH CHECK (
    cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid())
  );
CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE USING (
    cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid())
  );
CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE USING (
    cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid())
  );

-- ── orders ────────────────────────────────────────
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT USING (auth.uid() = user_id);

-- ── order_items ───────────────────────────────────
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
  );

-- ── reviews ───────────────────────────────────────
CREATE POLICY "Anyone can read reviews"
  ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create own review"
  ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own review"
  ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own review"
  ON reviews FOR DELETE USING (auth.uid() = user_id);


-- ═══════════════════════════════════════════════════
-- 3/4 — Indexes de performance
-- ═══════════════════════════════════════════════════

CREATE INDEX idx_carts_user_active ON carts(user_id) WHERE status = 'active';
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_stripe ON orders(stripe_session_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_reviews_product ON reviews(product_slug);
CREATE INDEX idx_reviews_user ON reviews(user_id);


-- ═══════════════════════════════════════════════════
-- 4/4 — Fonction RPC (points de fidélité)
-- ═══════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION increment_loyalty(user_id_input UUID, points_input INT)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET loyalty_points = loyalty_points + points_input
  WHERE id = user_id_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
