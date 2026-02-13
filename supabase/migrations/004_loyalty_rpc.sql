-- Fonction RPC pour incrémenter les points de fidélité
CREATE OR REPLACE FUNCTION increment_loyalty(user_id_input UUID, points_input INT)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET loyalty_points = loyalty_points + points_input
  WHERE id = user_id_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
