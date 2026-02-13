/* ── Sanity document types ─────────────────────── */

export interface Category {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  image?: ProductImage;
  order: number;
}

export interface ProductImage {
  _key: string;
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
}

export type Tag = "Bio" | "Pimenté" | "Surgelé";

export interface Product {
  _id: string;
  title: string;
  slug: string;
  price: number;
  currency: string;
  images: ProductImage[];
  description?: string;
  category?: Category;
  tags: Tag[];
  originCountry: string;
  spicyLevel: number;
  isFrozen: boolean;
  isOrganic: boolean;
  stock: number;
  isFeatured: boolean;
  relatedProducts?: Product[];
}

/* ── Cart ──────────────────────────────────────── */

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  currency: string;
  image?: string;
  quantity: number;
}

/* ── Checkout ─────────────────────────────────── */

export type DeliveryMode = "delivery" | "pickup";

export interface CheckoutPayload {
  items: CartItem[];
  deliveryMode: DeliveryMode;
  customerName: string;
  customerEmail: string;
  phone: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    province: string;
    country: string;
  };
  pickupSlot?: string;
}

/* ── Order (Supabase) ─────────────────────────── */

export interface Order {
  id: string;
  user_id?: string;
  stripe_session_id: string;
  payment_intent_id?: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled" | "refunded";
  delivery_mode: DeliveryMode;
  customer_email: string;
  customer_name: string;
  phone?: string;
  address?: CheckoutPayload["address"];
  pickup_slot?: string;
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  created_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_slug: string;
  name: string;
  price_cents: number;
  quantity: number;
}

/* ── Profile (Supabase) ──────────────────────── */

export interface Profile {
  id: string;
  full_name?: string;
  phone?: string;
  loyalty_points: number;
  created_at: string;
}

/* ── Review (Supabase) ───────────────────────── */

export interface Review {
  id: string;
  user_id: string;
  product_slug: string;
  rating: number;
  comment?: string;
  is_verified: boolean;
  created_at: string;
  profiles?: { full_name: string };
}
