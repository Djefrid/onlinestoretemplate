import { StarRating } from "./StarRating";
import type { Review } from "@/types";

interface ReviewCardProps {
  review: Review;
}

function relativeDate(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Hier";
  if (days < 30) return `Il y a ${days} jour${days > 1 ? "s" : ""}`;
  const months = Math.floor(days / 30);
  if (months < 12) return `Il y a ${months} mois`;
  const years = Math.floor(months / 12);
  return `Il y a ${years} an${years > 1 ? "s" : ""}`;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const authorLabel = review.author_name?.trim() || "Client anonyme";

  return (
    <div className="rounded-2xl border border-foreground/[0.07] bg-card p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Avatar initiale */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {authorLabel.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">{authorLabel}</span>
              {review.is_verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-green-700">
                  ✓ Achat vérifié
                </span>
              )}
            </div>
            <p className="text-xs text-foreground/40">{relativeDate(review.created_at)}</p>
          </div>
        </div>
        <StarRating value={review.rating} size="sm" />
      </div>

      {/* Commentaire */}
      {review.comment && (
        <p className="mt-3 text-sm leading-relaxed text-foreground/70">{review.comment}</p>
      )}

      {/* Réponse admin */}
      {review.admin_reply && (
        <div className="mt-4 rounded-xl border border-primary/10 bg-primary/[0.03] p-3 pl-4">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-primary">
            Réponse de la boutique
          </p>
          <p className="text-sm leading-relaxed text-foreground/65">{review.admin_reply}</p>
        </div>
      )}
    </div>
  );
}
