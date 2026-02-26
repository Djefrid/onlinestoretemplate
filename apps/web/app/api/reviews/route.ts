import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { createClient, createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { reviewSchema } from "@/lib/validators/review";

/* ── GET /api/reviews?product_slug=... ─────────────────────── */

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ reviews: [], average: 0, count: 0 });
  }

  const { searchParams } = new URL(request.url);
  const productSlug = searchParams.get("product_slug");

  if (!productSlug) {
    return NextResponse.json({ error: "product_slug requis" }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const { data: reviews, error } = await supabase
      .from("reviews")
      .select("id, author_name, rating, comment, is_verified, admin_reply, created_at")
      .eq("product_slug", productSlug)
      .eq("status", "approved")
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const count = reviews?.length ?? 0;
    const average =
      count > 0
        ? Math.round(((reviews ?? []).reduce((s, r) => s + r.rating, 0) / count) * 10) / 10
        : 0;

    return NextResponse.json({ reviews: reviews ?? [], average, count });
  } catch (err) {
    console.error("[GET /api/reviews]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

/* ── POST /api/reviews ─────────────────────────────────────── */

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  /* 1. Validation Zod */
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { product_slug, author_name, author_email, rating, comment } = parsed.data;

  /* 2. Hash de l'IP côté serveur (jamais stocker l'IP brute) */
  const forwarded = request.headers.get("x-forwarded-for");
  const rawIp = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  const ipHash = createHash("sha256").update(rawIp).digest("hex").slice(0, 32);

  const uaRaw = request.headers.get("user-agent") ?? "";
  const uaHash = createHash("sha256").update(uaRaw).digest("hex").slice(0, 32);

  /* 3. Rate limit : 1 avis par (ip_hash + product_slug) / 30 minutes */
  try {
    const service = await createServiceClient();
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

    const { data: existing } = await service
      .from("reviews")
      .select("id")
      .eq("ip_hash", ipHash)
      .eq("product_slug", product_slug)
      .gte("created_at", thirtyMinutesAgo)
      .limit(1)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "Vous avez déjà soumis un avis récemment. Réessayez dans 30 minutes." },
        { status: 429 },
      );
    }

    /* 4. Auth optionnelle : user_id + is_verified (achat confirmé) */
    let userId: string | null = null;
    let isVerified = false;

    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        userId = user.id;

        // Vérifier achat : order_items avec ce product_slug + ordre paid/shipped/delivered
        const { data: orderItem } = await service
          .from("order_items")
          .select("id, orders!inner(status)")
          .eq("product_slug", product_slug)
          .eq("orders.user_id", userId)
          .in("orders.status", ["paid", "shipped", "delivered"])
          .limit(1)
          .maybeSingle();

        isVerified = !!orderItem;
      }
    } catch {
      // auth optionnelle — silently ignore
    }

    /* 5. Insert avec service role (bypasse RLS) */
    const { data: review, error: insertError } = await service
      .from("reviews")
      .insert({
        product_slug,
        user_id: userId,
        author_name: author_name.trim(),
        author_email: author_email?.trim() || null,
        rating,
        comment: comment.trim(),
        status: "approved",
        is_verified: isVerified,
        ip_hash: ipHash,
        user_agent_hash: uaHash,
      })
      .select("id, author_name, rating, comment, is_verified, admin_reply, created_at")
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({ review }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/reviews]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
