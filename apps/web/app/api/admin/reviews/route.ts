import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { verifyAdminJson } from "@/lib/auth/verifyAdminJson";

/* ── GET /api/admin/reviews?status=...&search=... ─────────── */

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const auth = await verifyAdminJson();
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status"); // 'approved' | 'hidden' | null = all
  const searchSlug = searchParams.get("search");

  try {
    const service = await createServiceClient();
    let query = service
      .from("reviews")
      .select(
        "id, product_slug, user_id, author_name, author_email, rating, comment, status, is_deleted, is_verified, admin_reply, ip_hash, created_at, updated_at",
      )
      .order("created_at", { ascending: false });

    if (statusFilter === "approved" || statusFilter === "hidden") {
      query = query.eq("status", statusFilter);
    }

    if (searchSlug) {
      query = query.ilike("product_slug", `%${searchSlug}%`);
    }

    const { data: reviews, error } = await query;
    if (error) throw error;

    return NextResponse.json({ reviews: reviews ?? [] });
  } catch (err) {
    console.error("[GET /api/admin/reviews]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

/* ── PATCH /api/admin/reviews ──────────────────────────────── */

const patchSchema = z.object({
  id: z.string().uuid(),
  action: z.enum(["hide", "show", "delete", "reply"]),
  payload: z
    .object({
      admin_reply: z.string().max(2000).optional(),
    })
    .optional(),
});

export async function PATCH(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const auth = await verifyAdminJson();
  if (auth instanceof NextResponse) return auth;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { id, action, payload } = parsed.data;

  const updateMap: Record<string, unknown> = {};
  switch (action) {
    case "hide":
      updateMap.status = "hidden";
      break;
    case "show":
      updateMap.status = "approved";
      updateMap.is_deleted = false;
      break;
    case "delete":
      updateMap.is_deleted = true;
      break;
    case "reply":
      if (!payload?.admin_reply && payload?.admin_reply !== "") {
        return NextResponse.json({ error: "admin_reply requis pour action reply" }, { status: 400 });
      }
      updateMap.admin_reply = payload.admin_reply?.trim() || null;
      break;
  }

  try {
    const service = await createServiceClient();
    const { data: review, error } = await service
      .from("reviews")
      .update(updateMap)
      .eq("id", id)
      .select("id, status, is_deleted, admin_reply, updated_at")
      .single();

    if (error) throw error;
    if (!review) return NextResponse.json({ error: "Avis introuvable" }, { status: 404 });

    return NextResponse.json({ review });
  } catch (err) {
    console.error("[PATCH /api/admin/reviews]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
