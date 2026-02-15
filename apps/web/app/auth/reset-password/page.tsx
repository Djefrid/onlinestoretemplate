"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/auth/callback?next=/account`,
      },
    );

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="container-page section-padding flex justify-center">
        <div className="w-full max-w-md text-center">
          <div className="mb-4 text-4xl">📧</div>
          <h1 className="font-display text-3xl font-bold">
            Vérifiez vos emails
          </h1>
          <p className="mt-4 text-sm text-foreground/60">
            Si un compte existe avec l&apos;adresse <strong>{email}</strong>,
            vous recevrez un lien de réinitialisation dans quelques minutes.
          </p>
          <Link
            href="/auth/login"
            className="mt-6 inline-block text-sm font-medium text-accent hover:text-accent-dark"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page section-padding flex justify-center">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold">
            Mot de passe oublié
          </h1>
          <p className="mt-2 text-sm text-foreground/60">
            Entrez votre adresse email pour recevoir un lien de
            réinitialisation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground/70">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-lg border border-foreground/10 bg-white px-4 py-3 text-sm transition-colors focus:border-accent focus:outline-none"
              placeholder="votre@email.com"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Envoi…" : "Envoyer le lien"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-foreground/50">
          <Link
            href="/auth/login"
            className="font-medium text-accent hover:text-accent-dark"
          >
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
}
