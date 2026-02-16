import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { checkoutSchema } from "@/lib/validators/checkout";
import { createClient } from "@/lib/supabase/server";
import { isSanityConfigured } from "@/lib/sanity/client";
import { getPricesBySlugs } from "@/lib/sanity/queries";

const SHIPPING_COST = parseFloat(process.env.NEXT_PUBLIC_SHIPPING_COST || "5.99");
const FREE_SHIPPING_THRESHOLD = parseFloat(
  process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || "75",
);
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3007";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // SECURITY: Honeypot anti-bot — reject if hidden field is filled
    if (body.website) {
      return NextResponse.json(
        { error: "Requête invalide" },
        { status: 400 },
      );
    }

    // Validate with Zod
    const result = checkoutSchema.safeParse(body);
    if (!result.success) {
      const firstError = result.error.errors[0];
      return NextResponse.json(
        { error: firstError?.message || "Données invalides" },
        { status: 400 },
      );
    }

    const data = result.data;

    // ── Server-side price verification ──────────────────
    // SECURITY: Never trust client-submitted prices.
    // Fetch real prices from Sanity CMS and use those instead.
    let verifiedItems: {
      name: string;
      price: number;
      currency: string;
      slug: string;
      productId: string;
      quantity: number;
    }[];

    if (isSanityConfigured) {
      const slugs = data.items.map((item) => item.slug);
      const realPrices = await getPricesBySlugs(slugs);

      verifiedItems = data.items.map((item) => {
        const real = realPrices[item.slug];
        if (!real) {
          throw new Error(`Produit introuvable: ${item.slug}`);
        }
        return {
          name: real.title,
          price: real.price,
          currency: real.currency || "CAD",
          slug: item.slug,
          productId: item.productId,
          quantity: item.quantity,
        };
      });
    } else {
      // Sanity not configured (dev mode) — use client prices as fallback
      verifiedItems = data.items.map((item) => ({
        name: item.name,
        price: item.price,
        currency: item.currency || "CAD",
        slug: item.slug,
        productId: item.productId,
        quantity: item.quantity,
      }));
    }

    // Get current user (optional — guests can checkout too)
    let userId: string | undefined;
    let cartId: string | undefined;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
        // Get active cart id
        const { data: cart } = await supabase
          .from("carts")
          .select("id")
          .eq("user_id", user.id)
          .eq("status", "active")
          .single();
        if (cart) cartId = cart.id;
      }
    } catch {
      // Supabase not configured or auth failed — continue as guest
    }

    // Calculate shipping with VERIFIED prices
    const subtotal = verifiedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const shippingFree =
      data.deliveryMode === "pickup" || subtotal >= FREE_SHIPPING_THRESHOLD;
    const shippingAmount = shippingFree ? 0 : SHIPPING_COST;

    // Build Stripe line items with VERIFIED prices
    const lineItems = verifiedItems.map((item) => ({
      price_data: {
        currency: item.currency.toLowerCase(),
        product_data: {
          name: item.name,
          metadata: {
            productId: item.productId,
            slug: item.slug,
          },
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Add shipping as a line item if applicable
    if (shippingAmount > 0) {
      lineItems.push({
        price_data: {
          currency: "cad",
          product_data: {
            name: "Frais de livraison",
            metadata: { productId: "shipping", slug: "shipping" },
          },
          unit_amount: Math.round(shippingAmount * 100),
        },
        quantity: 1,
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      customer_email: data.customerEmail,
      success_url: `${BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/cancel`,
      metadata: {
        deliveryMode: data.deliveryMode,
        customerName: data.customerName,
        phone: data.phone,
        ...(userId && { userId }),
        ...(cartId && { cartId }),
        ...(data.deliveryMode === "pickup" && {
          pickupSlot: data.pickupSlot || "",
        }),
        ...(data.deliveryMode === "delivery" &&
          data.address && {
            addressLine1: data.address.line1,
            addressLine2: data.address.line2 || "",
            addressCity: data.address.city,
            addressPostalCode: data.address.postalCode,
            addressProvince: data.address.province,
            addressCountry: data.address.country,
          }),
        // Store items summary in metadata (Stripe limits to 500 chars per value)
        itemsSummary: verifiedItems
          .map((i) => `${i.slug}×${i.quantity}`)
          .join(",")
          .slice(0, 490),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[api/checkout] Error:", err);
    return NextResponse.json(
      { error: "Erreur lors de la création de la session de paiement." },
      { status: 500 },
    );
  }
}
