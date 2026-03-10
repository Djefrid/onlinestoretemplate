import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/sanity/siteSettings";

/**
 * GET /api/config
 * Retourne la configuration publique de la boutique (shipping, créneaux).
 * Utilisé par les composants client (CartDrawer, CartSummary, checkout).
 * Cache 60s côté CDN, stale-while-revalidate 5min.
 */
export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json(
      {
        shippingCost: settings.shippingCost ?? 5.99,
        freeShippingThreshold: settings.freeShippingThreshold ?? 75,
        pickupSlots: settings.pickupSlots ?? [],
      },
      {
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        },
      },
    );
  } catch {
    return NextResponse.json({
      shippingCost: 5.99,
      freeShippingThreshold: 75,
      pickupSlots: [],
    });
  }
}
