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

/* ── Order (Sanity) ───────────────────────────── */

export interface Order {
  _id: string;
  stripeSessionId: string;
  stripePaymentIntentId?: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  customerName: string;
  customerEmail: string;
  phone: string;
  deliveryMode: DeliveryMode;
  address?: CheckoutPayload["address"];
  pickupSlot?: string;
  items: {
    productId: string;
    slug: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  totals: {
    subtotal: number;
    shipping: number;
    total: number;
  };
  createdAt: string;
}
