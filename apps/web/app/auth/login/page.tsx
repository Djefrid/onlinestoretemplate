"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? "Email ou mot de passe incorrect."
          : authError.message,
      );
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold">Connexion</h1>
        <p className="mt-2 text-sm text-foreground/60">
          Connectez-vous pour accéder à votre compte
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

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground/70">
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-foreground/10 bg-white px-4 py-3 text-sm transition-colors focus:border-accent focus:outline-none"
            placeholder="••••••••"
          />
        </div>

        <div className="text-right">
          <Link
            href="/auth/reset-password"
            className="text-xs text-foreground/40 hover:text-accent"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Connexion…" : "Se connecter"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-foreground/50">
        Pas encore de compte ?{" "}
        <Link
          href="/auth/register"
          className="font-medium text-accent hover:text-accent-dark"
        >
          Créer un compte
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="container-page section-padding flex justify-center">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
