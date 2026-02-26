"use client";

import { useState } from "react";
import { StarRating } from "@/components/product/StarRating";
import type { Review } from "@/types";

interface AdminReviewsTableProps {
  initialReviews: Review[];
}

type FilterStatus = "all" | "approved" | "hidden";

function relativeDate(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Aujourd'hui";
  if (days < 7) return `Il y a ${days}j`;
  return new Date(dateStr).toLocaleDateString("fr-CA", { day: "2-digit", month: "short", year: "2-digit" });
}

export function AdminReviewsTable({ initialReviews }: AdminReviewsTableProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [searchSlug, setSearchSlug] = useState("");
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [replyOpen, setReplyOpen] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const filtered = reviews.filter((r) => {
    if (filterStatus === "approved" && r.status !== "approved") return false;
    if (filterStatus === "hidden" && r.status !== "hidden") return false;
    if (r.is_deleted) return false;
    if (searchSlug && !r.product_slug.toLowerCase().includes(searchSlug.toLowerCase())) return false;
    return true;
  });

  async function applyAction(
    id: string,
    action: "hide" | "show" | "delete" | "reply",
    payload?: { admin_reply: string },
  ) {
    setLoading((p) => ({ ...p, [id]: true }));

    // Optimistic update
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (action === "hide") return { ...r, status: "hidden" };
        if (action === "show") return { ...r, status: "approved", is_deleted: false };
        if (action === "delete") return { ...r, is_deleted: true };
        if (action === "reply") return { ...r, admin_reply: payload?.admin_reply ?? null };
        return r;
      }),
    );

    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, payload }),
      });

      if (!res.ok) {
        // Rollback
        setReviews(initialReviews);
        const data = await res.json();
        alert(data.error ?? "Erreur lors de l'action.");
      } else if (action === "reply") {
        setReplyOpen((p) => ({ ...p, [id]: false }));
      }
    } catch {
      setReviews(initialReviews);
      alert("Erreur réseau.");
    } finally {
      setLoading((p) => ({ ...p, [id]: false }));
    }
  }

  return (
    <div>
      {/* Filtres */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-white/10 overflow-hidden text-xs">
          {(["all", "approved", "hidden"] as FilterStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={[
                "px-3 py-1.5 transition-colors",
                filterStatus === s
                  ? "bg-white/15 text-white"
                  : "text-white/40 hover:text-white/70",
              ].join(" ")}
            >
              {s === "all" ? "Tous" : s === "approved" ? "Approuvés" : "Masqués"}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Filtrer par produit…"
          value={searchSlug}
          onChange={(e) => setSearchSlug(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs text-white placeholder:text-white/30 outline-none focus:border-white/20"
        />

        <p className="ml-auto text-xs text-white/30">
          {filtered.length} avis{filtered.length > 1 ? "" : ""}
        </p>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-white/[0.07] py-16 text-center">
          <p className="text-sm text-white/30">Aucun avis correspondant.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((review) => (
            <div
              key={review.id}
              className={[
                "rounded-xl border p-4 transition-opacity",
                review.status === "hidden"
                  ? "border-white/[0.05] bg-white/[0.02] opacity-60"
                  : "border-white/[0.08] bg-white/[0.04]",
              ].join(" ")}
            >
              {/* Top row */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <StarRating value={review.rating} size="sm" />
                  <span className="text-sm font-semibold text-white">
                    {review.author_name ?? "Anonyme"}
                  </span>
                  {review.is_verified && (
                    <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-[10px] font-semibold text-green-400">
                      Vérifié
                    </span>
                  )}
                  {review.status === "hidden" && (
                    <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                      Masqué
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-white/30">
                  <span className="font-mono">{review.product_slug}</span>
                  <span>·</span>
                  <span>{relativeDate(review.created_at)}</span>
                </div>
              </div>

              {/* Comment */}
              {review.comment && (
                <p className="mt-2 line-clamp-3 text-sm text-white/55">{review.comment}</p>
              )}

              {/* Existing reply */}
              {review.admin_reply && !replyOpen[review.id] && (
                <div className="mt-2 rounded-lg border border-rose-400/10 bg-rose-400/5 px-3 py-2">
                  <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-rose-400">
                    Votre réponse
                  </p>
                  <p className="text-xs text-white/50">{review.admin_reply}</p>
                </div>
              )}

              {/* Inline reply form */}
              {replyOpen[review.id] && (
                <div className="mt-3">
                  <textarea
                    rows={3}
                    placeholder="Votre réponse publique…"
                    value={replyDrafts[review.id] ?? review.admin_reply ?? ""}
                    onChange={(e) =>
                      setReplyDrafts((p) => ({ ...p, [review.id]: e.target.value }))
                    }
                    className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20"
                    maxLength={2000}
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() =>
                        applyAction(review.id, "reply", {
                          admin_reply: replyDrafts[review.id] ?? "",
                        })
                      }
                      disabled={loading[review.id]}
                      className="rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                    >
                      {loading[review.id] ? "…" : "Enregistrer"}
                    </button>
                    <button
                      onClick={() => setReplyOpen((p) => ({ ...p, [review.id]: false }))}
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/50 hover:text-white"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-3 flex flex-wrap gap-2 border-t border-white/[0.05] pt-3">
                {review.status === "approved" ? (
                  <ActionButton
                    onClick={() => applyAction(review.id, "hide")}
                    disabled={loading[review.id]}
                    color="amber"
                  >
                    Masquer
                  </ActionButton>
                ) : (
                  <ActionButton
                    onClick={() => applyAction(review.id, "show")}
                    disabled={loading[review.id]}
                    color="green"
                  >
                    Réafficher
                  </ActionButton>
                )}

                <ActionButton
                  onClick={() => setReplyOpen((p) => ({ ...p, [review.id]: !p[review.id] }))}
                  disabled={loading[review.id]}
                  color="rose"
                >
                  {replyOpen[review.id] ? "Annuler" : review.admin_reply ? "Modifier réponse" : "Répondre"}
                </ActionButton>

                <ActionButton
                  onClick={() => {
                    if (confirm("Supprimer définitivement cet avis ?")) {
                      applyAction(review.id, "delete");
                    }
                  }}
                  disabled={loading[review.id]}
                  color="red"
                >
                  Supprimer
                </ActionButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  disabled,
  color,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  color: "amber" | "green" | "rose" | "red";
}) {
  const colorMap = {
    amber: "border-amber-500/20 text-amber-400 hover:bg-amber-500/10",
    green: "border-green-500/20 text-green-400 hover:bg-green-500/10",
    rose: "border-rose-500/20 text-rose-400 hover:bg-rose-500/10",
    red: "border-red-500/20 text-red-400 hover:bg-red-500/10",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        "rounded-lg border px-3 py-1 text-xs font-medium transition-colors disabled:opacity-40",
        colorMap[color],
      ].join(" ")}
    >
      {children}
    </button>
  );
}
