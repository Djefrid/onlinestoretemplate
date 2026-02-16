import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

const MAX_ADMIN_SESSION_AGE_MS = 4 * 60 * 60 * 1000; // 4 hours

/**
 * Server-side guard: redirects if user is not authenticated or not admin.
 * Also enforces a maximum session age for admin accounts (4h).
 * Usage: `await requireAdmin()` at the top of any Server Component.
 */
export async function requireAdmin() {
  if (!isSupabaseConfigured) {
    redirect("/");
  }

  const supabase = await createClient();

  // Check session age — force re-auth if too old
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/admin-hub/login?redirect=/admin-hub");
  }

  // expires_at is a UNIX timestamp (seconds). Session typically lasts 1h.
  // If the session was refreshed long ago, force re-auth.
  const expiresAt = (session.expires_at ?? 0) * 1000;
  const sessionCreatedApprox = expiresAt - 3600 * 1000; // Supabase default 1h token
  const sessionAge = Date.now() - sessionCreatedApprox;
  if (sessionAge > MAX_ADMIN_SESSION_AGE_MS) {
    await supabase.auth.signOut();
    redirect("/admin-hub/login?reason=session_expired&redirect=/admin-hub");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin-hub/login?redirect=/admin-hub");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/");
  }

  return { user, role: profile.role as string };
}
