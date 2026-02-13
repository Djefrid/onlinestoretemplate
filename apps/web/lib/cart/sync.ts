"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { CartItem } from "@/types";

/**
 * Get or create the active cart for a user.
 */
async function getOrCreateCart(supabase: SupabaseClient, userId: string) {
  // Try to find existing active cart
  const { data: existing } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "active")
    .single();

  if (existing) return existing.id as string;

  // Create a new cart
  const { data: created } = await supabase
    .from("carts")
    .insert({ user_id: userId })
    .select("id")
    .single();

  return created?.id as string;
}

/**
 * Pull cart items from Supabase into the local format.
 */
export async function pullCartFromSupabase(
  supabase: SupabaseClient,
  userId: string,
): Promise<CartItem[]> {
  const cartId = await getOrCreateCart(supabase, userId);

  const { data: items } = await supabase
    .from("cart_items")
    .select("*")
    .eq("cart_id", cartId);

  if (!items) return [];

  return items.map((item) => ({
    productId: item.product_slug,
    slug: item.product_slug,
    name: item.name,
    price: item.price_cents / 100,
    currency: "CAD",
    image: item.image_url || undefined,
    quantity: item.quantity,
  }));
}

/**
 * Push local cart items to Supabase (replaces remote cart).
 */
export async function pushCartToSupabase(
  supabase: SupabaseClient,
  userId: string,
  items: CartItem[],
): Promise<void> {
  const cartId = await getOrCreateCart(supabase, userId);

  // Clear existing items
  await supabase.from("cart_items").delete().eq("cart_id", cartId);

  if (items.length === 0) return;

  // Insert current items
  const rows = items.map((item) => ({
    cart_id: cartId,
    product_slug: item.slug,
    name: item.name,
    price_cents: Math.round(item.price * 100),
    quantity: item.quantity,
    image_url: item.image || null,
  }));

  await supabase.from("cart_items").insert(rows);

  // Update cart timestamp
  await supabase
    .from("carts")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", cartId);
}

/**
 * Merge local + remote carts. Local items take priority for quantity.
 */
export function mergeCarts(
  local: CartItem[],
  remote: CartItem[],
): CartItem[] {
  const merged = new Map<string, CartItem>();

  // Remote first (lower priority)
  for (const item of remote) {
    merged.set(item.slug, item);
  }

  // Local overrides (higher priority — more recent user intent)
  for (const item of local) {
    const existing = merged.get(item.slug);
    if (existing) {
      merged.set(item.slug, {
        ...item,
        quantity: Math.max(item.quantity, existing.quantity),
      });
    } else {
      merged.set(item.slug, item);
    }
  }

  return Array.from(merged.values());
}
