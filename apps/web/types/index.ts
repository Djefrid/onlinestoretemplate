/* ── Site Settings (Sanity singleton) ─────────── */

export interface SiteSettings {
  shopName: string;
  tagline?: string;
  logoUrl?: string;
  email?: string;
  supportEmail?: string;
  phone?: string;
  whatsapp?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    country?: string;
    googleMapsUrl?: string;
  };
  openingHours?: string;
  deliveryZones?: string;
  pickupInstructions?: string;
  announcementBar?: {
    enabled: boolean;
    text?: string;
    linkLabel?: string;
    linkUrl?: string;
  };
  hero?: {
    bannerUrl?: string;
    bannerAlt?: string;
    heroTitle?: string;
    heroSubtitle?: string;
  };
  shopStatus?: {
    isOpen: boolean;
    closedMessage?: string;
    reopenDate?: string;
  };
  socials?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    youtube?: string;
  };
}

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  description?: any; // Portable Text blocks
  category?: Category;
  tags: Tag[];
  originCountry: string;
  spicyLevel: number;
  isFrozen: boolean;
  isOrganic: boolean;
  stock: number;
  isFeatured: boolean;
  isBestSeller?: boolean;
  ratingAverage?: number;
  reviewsCount?: number;
  badge?: string;
  preparationTips?: string;
  producerNote?: string;
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
  role?: string; // 'admin' | 'customer'
  created_at: string;
}

/* ── Review (Supabase) ───────────────────────── */

export interface Review {
  id: string;
  user_id?: string | null;
  product_slug: string;
  author_name?: string | null;
  author_email?: string | null;
  rating: number;
  comment?: string;
  status: "approved" | "hidden";
  is_deleted: boolean;
  is_verified: boolean;
  admin_reply?: string | null;
  ip_hash?: string | null;
  created_at: string;
  updated_at?: string;
}
