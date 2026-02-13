-- ═══════════════════════════════════════════════════
-- Row Level Security — Policies
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
