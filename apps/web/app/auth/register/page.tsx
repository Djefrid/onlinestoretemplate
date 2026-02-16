"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="container-page flex min-h-[calc(100vh-5rem)] items-center justify-center py-10">
        <div className="w-full max-w-md text-center">
          <span className="mb-4 block text-5xl">📧</span>
          <h1 className="font-display text-2xl font-bold">Vérifiez votre email</h1>
          <p className="mt-3 text-sm text-foreground/60">
            Un lien de confirmation a été envoyé à <strong>{email}</strong>.
            Cliquez dessus pour activer votre compte.
          </p>
          <div className="mt-8">
            <Button href="/auth/login" variant="outline">
              Retour à la connexion
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page flex min-h-[calc(100vh-5rem)] items-center justify-center py-10">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold">Créer un compte</h1>
          <p className="mt-2 text-sm text-foreground/60">
            Rejoignez-nous pour suivre vos commandes et laisser des avis
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground/70">
              Nom complet
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
              className="w-full rounded-lg border border-foreground/10 bg-card px-4 py-3 text-sm transition-colors focus:border-primary focus:outline-none"
              placeholder="Jean Dupont"
            />
          </div>

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
              className="w-full rounded-lg border border-foreground/10 bg-card px-4 py-3 text-sm transition-colors focus:border-primary focus:outline-none"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground/70">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              minLength={6}
              className="w-full rounded-lg border border-foreground/10 bg-card px-4 py-3 text-sm transition-colors focus:border-primary focus:outline-none"
              placeholder="Minimum 6 caractères"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Création…" : "Créer mon compte"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-foreground/50">
          Déjà un compte ?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-primary hover:text-primary-dark"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
