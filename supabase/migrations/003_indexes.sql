-- ═══════════════════════════════════════════════════
-- Indexes pour performance
-- ═══════════════════════════════════════════════════

CREATE INDEX idx_carts_user_active ON carts(user_id) WHERE status = 'active';
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_stripe ON orders(stripe_session_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_reviews_product ON reviews(product_slug);
CREATE INDEX idx_reviews_user ON reviews(user_id);
