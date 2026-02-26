"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="text-sm text-[#6858D8] font-medium">
        ✓ Merci ! Vous êtes bien inscrit(e).
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-1 flex flex-col gap-2">
      <div className="flex overflow-hidden rounded-xl border border-white/10 bg-white/5 focus-within:border-[#6858D8]/50 transition-colors">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          required
          className="flex-1 bg-transparent px-3 py-2.5 text-sm text-[#F1F5F9] placeholder:text-white/30 outline-none"
          aria-label="Adresse e-mail pour la newsletter"
          disabled={status === "loading"}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          aria-label="S'inscrire à la newsletter"
          className="flex items-center justify-center px-3 text-white/50 hover:text-[#6858D8] transition-colors disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
      {status === "error" && (
        <p className="text-xs text-red-400">Une erreur est survenue. Réessayez.</p>
      )}
      <p className="text-[11px] text-white/25">
        Pas de spam. Désinscription possible à tout moment.
      </p>
    </form>
  );
}
