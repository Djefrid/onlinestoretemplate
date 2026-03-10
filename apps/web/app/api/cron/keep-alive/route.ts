import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * Vercel Cron Job — Keep-alive Supabase
 * Empêche la mise en pause automatique du projet Supabase (free tier : 7 jours d'inactivité).
 * Planifié toutes les 3 jours dans vercel.json.
 *
 * Vercel injecte automatiquement le header Authorization: Bearer {CRON_SECRET}
 */
export async function GET(request: NextRequest) {
  // Vérification du secret Vercel Cron
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: Record<string, string> = {};

  // ── Ping Supabase ──────────────────────────────────────────────────────────
  try {
    const supabase = await createServiceClient();

    // Requête ultra-légère : compte les produits dans orders (table toujours existante)
    const { error } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true });

    results.supabase = error ? `error: ${error.message}` : "ok";
  } catch (err) {
    results.supabase = `exception: ${err instanceof Error ? err.message : "unknown"}`;
  }

  const allOk = Object.values(results).every((v) => v === "ok");

  console.log(`[cron/keep-alive] ${new Date().toISOString()}`, results);

  return NextResponse.json(
    {
      timestamp: new Date().toISOString(),
      status: allOk ? "ok" : "partial",
      services: results,
    },
    { status: allOk ? 200 : 207 },
  );
}
