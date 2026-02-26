"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StarRating } from "./StarRating";
import { reviewSchema } from "@/lib/validators/review";

interface ReviewFormProps {
  productSlug: string;
}

type FormState = "idle" | "loading" | "success" | "error";

export function ReviewForm({ productSlug }: ReviewFormProps) {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const [rating, setRating] = useState(0);
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setErrorMsg("");

    /* Validation client */
    const parsed = reviewSchema.safeParse({
      product_slug: productSlug,
      author_name: authorName,
      author_email: authorEmail || undefined,
      rating,
      comment,
    });

    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors as Record<string, string[]>);
      return;
    }

    setFormState("loading");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setErrorMsg(data.error ?? "Vous avez déjà soumis un avis récemment.");
        } else if (res.status === 400 && data.details) {
          setFieldErrors(data.details);
          setFormState("idle");
          return;
        } else {
          setErrorMsg(data.error ?? "Une erreur est survenue. Réessayez.");
        }
        setFormState("error");
        return;
      }

      setFormState("success");
      router.refresh(); // recharge le server component ReviewsSection
    } catch {
      setErrorMsg("Erreur réseau. Vérifiez votre connexion.");
      setFormState("error");
    }
  };

  if (formState === "success") {
    return (
      <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6 text-center">
        <p className="text-lg font-semibold text-green-700">Merci pour votre avis !</p>
        <p className="mt-1 text-sm text-foreground/50">Il sera visible dès maintenant.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-foreground/[0.07] bg-card p-6">
      <h3 className="mb-5 font-display text-lg font-bold">Laisser un avis</h3>

      {/* Étoiles */}
      <div className="mb-5">
        <label className="mb-2 block text-sm font-medium text-foreground/70">
          Note <span className="text-red-500">*</span>
        </label>
        <StarRating value={rating} onChange={setRating} size="lg" />
        {fieldErrors.rating && (
          <p className="mt-1 text-xs text-red-500">{fieldErrors.rating[0]}</p>
        )}
      </div>

      {/* Nom */}
      <div className="mb-4">
        <label htmlFor="review-name" className="mb-1.5 block text-sm font-medium text-foreground/70">
          Votre nom <span className="text-red-500">*</span>
        </label>
        <input
          id="review-name"
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Jean Dupont"
          className="w-full rounded-lg border border-foreground/10 bg-foreground/[0.03] px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
          maxLength={60}
        />
        {fieldErrors.author_name && (
          <p className="mt-1 text-xs text-red-500">{fieldErrors.author_name[0]}</p>
        )}
      </div>

      {/* Email */}
      <div className="mb-4">
        <label htmlFor="review-email" className="mb-1.5 block text-sm font-medium text-foreground/70">
          Email <span className="text-foreground/30 text-xs">(optionnel)</span>
        </label>
        <input
          id="review-email"
          type="email"
          value={authorEmail}
          onChange={(e) => setAuthorEmail(e.target.value)}
          placeholder="vous@exemple.com"
          className="w-full rounded-lg border border-foreground/10 bg-foreground/[0.03] px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
        />
        {fieldErrors.author_email && (
          <p className="mt-1 text-xs text-red-500">{fieldErrors.author_email[0]}</p>
        )}
      </div>

      {/* Commentaire */}
      <div className="mb-5">
        <label htmlFor="review-comment" className="mb-1.5 block text-sm font-medium text-foreground/70">
          Commentaire <span className="text-red-500">*</span>
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Partagez votre expérience avec ce produit…"
          rows={4}
          className="w-full resize-none rounded-lg border border-foreground/10 bg-foreground/[0.03] px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
          maxLength={2000}
        />
        <div className="mt-1 flex justify-between">
          {fieldErrors.comment ? (
            <p className="text-xs text-red-500">{fieldErrors.comment[0]}</p>
          ) : (
            <span />
          )}
          <p className="text-xs text-foreground/30">{comment.length}/2000</p>
        </div>
      </div>

      {/* Erreur globale */}
      {formState === "error" && errorMsg && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-600">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={formState === "loading"}
        className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-opacity disabled:opacity-50"
      >
        {formState === "loading" ? "Publication…" : "Publier mon avis"}
      </button>
    </form>
  );
}
