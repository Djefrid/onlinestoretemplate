"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirect");
  const redirect =
    rawRedirect && rawRedirect.startsWith("/") && !rawRedirect.startsWith("//")
      ? rawRedirect
      : "/admin-hub";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const isLocked = attempts >= 5;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLocked) {
      setError(
        "Trop de tentatives. Veuillez patienter quelques minutes avant de réessayer.",
      );
      return;
    }

    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) {
        setAttempts((prev) => prev + 1);
        setError("Identifiants invalides.");
        setLoading(false);
        return;
      }

      // Verify admin role before redirecting
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (!profile || profile.role !== "admin") {
        await supabase.auth.signOut();
        setError("Accès refusé. Ce compte n\u2019a pas les droits administrateur.");
        setLoading(false);
        return;
      }

      router.push(redirect);
      router.refresh();
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0F19] px-4">
      <div className="w-full max-w-sm">
        {/* Logo / Badge */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-400/10">
            <Shield className="h-7 w-7 text-orange-400" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-white">Administration</h1>
            <p className="mt-1 text-sm text-white/40">
              Espace réservé aux administrateurs
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#111827] p-6 shadow-2xl shadow-black/20">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/50">
                Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={isLocked}
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-white/20 transition-colors focus:border-orange-400/50 focus:outline-none focus:ring-1 focus:ring-orange-400/20 disabled:opacity-50"
                placeholder="admin@exemple.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/50">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={isLocked}
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 pr-10 text-sm text-white placeholder:text-white/20 transition-colors focus:border-orange-400/50 focus:outline-none focus:ring-1 focus:ring-orange-400/20 disabled:opacity-50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3.5 py-2.5 text-sm text-red-400">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Attempts warning */}
            {attempts > 0 && attempts < 5 && !error && (
              <p className="text-xs text-white/30 text-center">
                {5 - attempts} tentative{5 - attempts > 1 ? "s" : ""} restante
                {5 - attempts > 1 ? "s" : ""}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || isLocked}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-400 px-4 py-2.5 text-sm font-semibold text-black transition-all hover:bg-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:ring-offset-2 focus:ring-offset-[#111827] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connexion…
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>
        </div>

        {/* Footer notice */}
        <p className="mt-6 text-center text-xs text-white/20">
          Accès restreint — Tentatives de connexion enregistrées
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginForm />
    </Suspense>
  );
}
