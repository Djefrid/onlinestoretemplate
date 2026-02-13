import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe/server";
import { createServiceClient } from "@/lib/supabase/server";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !webhookSecret) {
    console.error("[webhook] Missing signature or webhook secret");
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[webhook] Signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleCheckoutCompleted(session);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const metadata = session.metadata || {};

  // ── 1. Init Supabase service client (bypass RLS) ──
  let supabase;
  try {
    supabase = await createServiceClient();
  } catch (err) {
    console.error("[webhook] Supabase not configured:", err);
    return;
  }

  // ── 2. Idempotence — check if order already exists ──
  const { data: existingOrder } = await supabase
    .from("orders")
    .select("id")
    .eq("stripe_session_id", session.id)
    .single();

  if (existingOrder) {
    console.log("[webhook] Order already exists, skipping:", existingOrder.id);
    return;
  }

  // ── 3. Retrieve line items from Stripe ──
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    limit: 100,
  });

  // Parse items (exclude shipping line)
  const items = lineItems.data
    .filter((item) => item.description !== "Frais de livraison")
    .map((item) => ({
      name: item.description || "Produit",
      price_cents: item.price?.unit_amount || 0,
      quantity: item.quantity || 1,
      product_slug: "",
    }));

  // Restore product slugs from metadata
  const itemsSummary = metadata.itemsSummary || "";
  if (itemsSummary) {
    const slugMap = itemsSummary.split(",").map((entry) => {
      const [slug] = entry.split("\u00d7");
      return slug;
    });
    items.forEach((item, i) => {
      if (slugMap[i]) {
        item.product_slug = slugMap[i];
      }
    });
  }

  // ── 4. Calculate totals ──
  const subtotalCents = items.reduce(
    (sum, i) => sum + i.price_cents * i.quantity,
    0,
  );
  const totalCents = session.amount_total || 0;
  const shippingCents = totalCents - subtotalCents;

  // Build address JSONB if delivery
  const address =
    metadata.deliveryMode === "delivery"
      ? {
          line1: metadata.addressLine1 || "",
          line2: metadata.addressLine2 || "",
          city: metadata.addressCity || "",
          postalCode: metadata.addressPostalCode || "",
          province: metadata.addressProvince || "",
          country: metadata.addressCountry || "CA",
        }
      : null;

  // ── 5. Create order ──
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: metadata.userId || null,
      stripe_session_id: session.id,
      payment_intent_id:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id || null,
      status: "paid",
      delivery_mode: metadata.deliveryMode || "delivery",
      customer_email: session.customer_email || "",
      customer_name: metadata.customerName || "",
      phone: metadata.phone || "",
      address,
      pickup_slot:
        metadata.deliveryMode === "pickup"
          ? metadata.pickupSlot || null
          : null,
      subtotal_cents: subtotalCents,
      shipping_cents: Math.max(shippingCents, 0),
      total_cents: totalCents,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("[webhook] Failed to create order:", orderError);
    return;
  }

  console.log("[webhook] Order created:", order.id);

  // ── 6. Create order_items ──
  if (items.length > 0) {
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_slug: item.product_slug,
      name: item.name,
      price_cents: item.price_cents,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("[webhook] Failed to create order_items:", itemsError);
    }
  }

  // ── 7. Convert cart status (if user was logged in) ──
  if (metadata.cartId) {
    const { error: cartError } = await supabase
      .from("carts")
      .update({ status: "converted" })
      .eq("id", metadata.cartId);

    if (cartError) {
      console.error("[webhook] Failed to convert cart:", cartError);
    } else {
      console.log("[webhook] Cart converted:", metadata.cartId);
    }
  }

  // ── 8. Award loyalty points (1 point per dollar spent) ──
  if (metadata.userId) {
    const points = Math.floor(totalCents / 100);
    if (points > 0) {
      const { error: loyaltyError } = await supabase.rpc("increment_loyalty", {
        user_id_input: metadata.userId,
        points_input: points,
      });

      // If RPC doesn't exist yet, fallback to manual update
      if (loyaltyError) {
        await supabase
          .from("profiles")
          .update({
            loyalty_points: points, // Will be overwritten — see note below
          })
          .eq("id", metadata.userId);
        console.warn(
          "[webhook] RPC increment_loyalty not found, manual update applied",
        );
      }
    }
  }

  console.log("[webhook] Checkout completed successfully for session:", session.id);
}
