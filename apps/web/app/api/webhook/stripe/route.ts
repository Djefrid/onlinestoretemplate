import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe/server";
import { sanityWriteClient, isSanityConfigured } from "@/lib/sanity/client";

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

  // Retrieve line items from Stripe
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    limit: 100,
  });

  // Parse items (exclude shipping line)
  const items = lineItems.data
    .filter((item) => item.description !== "Frais de livraison")
    .map((item) => ({
      _key: crypto.randomUUID().slice(0, 8),
      productId: "",
      slug: "",
      name: item.description || "Produit",
      price: (item.price?.unit_amount || 0) / 100,
      quantity: item.quantity || 1,
    }));

  // Try to restore product IDs from metadata
  const itemsSummary = metadata.itemsSummary || "";
  if (itemsSummary) {
    const slugMap = itemsSummary.split(",").map((entry) => {
      const [slug, qty] = entry.split("\u00d7");
      return { slug, quantity: parseInt(qty, 10) };
    });
    items.forEach((item, i) => {
      if (slugMap[i]) {
        item.slug = slugMap[i].slug;
      }
    });
  }

  // Calculate totals
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = (session.amount_total || 0) / 100;
  const shipping = total - subtotal;

  // Build address object if delivery
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
      : undefined;

  const orderDoc = {
    _type: "order",
    stripeSessionId: session.id,
    stripePaymentIntentId:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id || "",
    status: "paid",
    customerName: metadata.customerName || "",
    customerEmail: session.customer_email || "",
    phone: metadata.phone || "",
    deliveryMode: metadata.deliveryMode || "delivery",
    ...(address && { address }),
    ...(metadata.deliveryMode === "pickup" && {
      pickupSlot: metadata.pickupSlot || "",
    }),
    items,
    totals: {
      subtotal: Math.round(subtotal * 100) / 100,
      shipping: Math.round(shipping * 100) / 100,
      total: Math.round(total * 100) / 100,
    },
    createdAt: new Date().toISOString(),
  };

  // Save to Sanity if configured
  if (isSanityConfigured && sanityWriteClient) {
    try {
      const created = await sanityWriteClient.create(orderDoc);
      console.log("[webhook] Order created in Sanity:", created._id);
    } catch (err) {
      console.error("[webhook] Failed to create order in Sanity:", err);
    }
  } else {
    console.log("[webhook] Sanity not configured — order logged only:");
    console.log(JSON.stringify(orderDoc, null, 2));
  }
}
