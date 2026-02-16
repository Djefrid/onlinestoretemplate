"use client";

import { Shield, ExternalLink, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin-hub/login");
    router.refresh();
  };

  return (
    <header className="border-b border-white/5 bg-[#111827]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        {/* Left — Admin badge */}
        <div className="flex items-center gap-2 rounded-lg bg-orange-400/10 px-3 py-1.5">
          <Shield className="h-4 w-4 text-orange-400" />
          <span className="text-sm font-semibold text-orange-400">Admin</span>
        </div>

        {/* Right — Actions */}
        <div className="flex items-center gap-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Voir le site</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-white/40 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>
    </header>
  );
}
