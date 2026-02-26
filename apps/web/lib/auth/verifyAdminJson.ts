import { NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

/**
 * Vérifie que la requête provient d'un admin authentifié.
 * À utiliser dans les API routes (retourne JSON 401/403 au lieu de redirect).
 *
 * Usage:
 *   const result = await verifyAdminJson();
 *   if (result instanceof NextResponse) return result; // 401 or 403
 *   const { user } = result;
 */
export async function verifyAdminJson(): Promise<
  { user: { id: string; email?: string } } | NextResponse
> {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return { user };
}
