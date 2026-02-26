import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { ReviewCard } from "./ReviewCard";
import { ReviewForm } from "./ReviewForm";
import { StarRating } from "./StarRating";
import type { Review } from "@/types";

interface ReviewsSectionProps {
  productSlug: string;
}

async function fetchReviews(slug: string): Promise<Review[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("reviews")
      .select("id, user_id, author_name, rating, comment, is_verified, admin_reply, status, is_deleted, created_at, updated_at")
      .eq("product_slug", slug)
      .eq("status", "approved")
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });
    return (data ?? []) as Review[];
  } catch {
    return [];
  }
}

export async function ReviewsSection({ productSlug }: ReviewsSectionProps) {
  const reviews = await fetchReviews(productSlug);
  const count = reviews.length;
  const average =
    count > 0
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / count) * 10) / 10
      : 0;

  return (
    <section className="mt-20">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold">Avis clients</h2>
          {count > 0 && (
            <div className="mt-1.5 flex items-center gap-2">
              <StarRating value={average} size="sm" />
              <span className="text-sm font-semibold text-foreground">{average}/5</span>
              <span className="text-sm text-foreground/40">
                ({count} avis{count > 1 ? "" : ""})
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
        {/* Liste des avis */}
        <div className="space-y-4">
          {count === 0 ? (
            <div className="rounded-2xl border border-dashed border-foreground/10 py-12 text-center">
              <p className="text-sm text-foreground/40">Aucun avis pour le moment.</p>
              <p className="mt-1 text-sm font-medium text-foreground/60">
                Soyez le premier à laisser un avis !
              </p>
            </div>
          ) : (
            reviews.map((review) => <ReviewCard key={review.id} review={review} />)
          )}
        </div>

        {/* Formulaire */}
        <div className="lg:sticky lg:top-28">
          <ReviewForm productSlug={productSlug} />
        </div>
      </div>
    </section>
  );
}
