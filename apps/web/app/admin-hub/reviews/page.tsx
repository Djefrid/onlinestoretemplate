import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminReviewsTable } from "@/components/admin/AdminReviewsTable";
import type { Review } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Avis clients — Admin Hub",
  robots: { index: false, follow: false },
};

async function fetchAllReviews(): Promise<Review[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("reviews")
      .select(
        "id, product_slug, user_id, author_name, author_email, rating, comment, status, is_deleted, is_verified, admin_reply, created_at, updated_at",
      )
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });
    return (data ?? []) as Review[];
  } catch {
    return [];
  }
}

export default async function AdminReviewsPage() {
  await requireAdmin();
  const reviews = await fetchAllReviews();

  return (
    <div className="min-h-screen bg-[#0B0F19]">
      <AdminHeader />

      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Avis clients</h1>
            <p className="mt-1 text-sm text-white/40">
              {reviews.length} avis au total — modérez, répondez, masquez ou supprimez.
            </p>
          </div>
          <a
            href="/admin-hub"
            className="rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-white/50 transition-colors hover:text-white"
          >
            ← Retour
          </a>
        </div>

        {/* Table interactive (client component) */}
        <AdminReviewsTable initialReviews={reviews} />
      </div>
    </div>
  );
}
