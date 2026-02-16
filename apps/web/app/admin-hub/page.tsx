import { Package, BarChart3, Users, CalendarDays } from "lucide-react";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { AdminHubCard } from "@/components/admin/AdminHubCard";
import { AdminHeader } from "@/components/admin/AdminHeader";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Hub",
  robots: { index: false, follow: false },
};

const cards = [
  {
    title: "Contenu & Produits",
    description:
      "Ajouter des produits, catégories, images et modifier les textes globaux (siteSettings).",
    envKey: "NEXT_PUBLIC_SANITY_STUDIO_URL",
    fallback: "/studio",
    icon: Package,
    accentColor: "text-orange-400",
    accentBorder: "hover:border-orange-400/50",
    accentGlow: "hover:shadow-orange-400/10",
    label: "Sanity Studio",
  },
  {
    title: "Finances & Commandes",
    description:
      "Voir les encaissements, paiements, remboursements et litiges.",
    envKey: "NEXT_PUBLIC_STRIPE_DASHBOARD_URL",
    fallback: "https://dashboard.stripe.com/",
    icon: BarChart3,
    accentColor: "text-violet-400",
    accentBorder: "hover:border-violet-400/50",
    accentGlow: "hover:shadow-violet-400/10",
    label: "Stripe Dashboard",
  },
  {
    title: "Base Clients",
    description: "Voir les utilisateurs, commandes, paniers et données.",
    envKey: "NEXT_PUBLIC_SUPABASE_DASHBOARD_URL",
    fallback: "https://supabase.com/dashboard",
    icon: Users,
    accentColor: "text-emerald-400",
    accentBorder: "hover:border-emerald-400/50",
    accentGlow: "hover:shadow-emerald-400/10",
    label: "Supabase Dashboard",
  },
  {
    title: "Planning RDV",
    description:
      "Modifier mes disponibilités, types de rendez-vous et horaires.",
    envKey: "NEXT_PUBLIC_CAL_DASHBOARD_URL",
    fallback: "https://app.cal.com/availability",
    icon: CalendarDays,
    accentColor: "text-sky-400",
    accentBorder: "hover:border-sky-400/50",
    accentGlow: "hover:shadow-sky-400/10",
    label: "Cal.com",
  },
];

function getUrl(envKey: string, fallback: string): string {
  const envVars: Record<string, string | undefined> = {
    NEXT_PUBLIC_SANITY_STUDIO_URL:
      process.env.NEXT_PUBLIC_SANITY_STUDIO_URL,
    NEXT_PUBLIC_STRIPE_DASHBOARD_URL:
      process.env.NEXT_PUBLIC_STRIPE_DASHBOARD_URL,
    NEXT_PUBLIC_SUPABASE_DASHBOARD_URL:
      process.env.NEXT_PUBLIC_SUPABASE_DASHBOARD_URL,
    NEXT_PUBLIC_CAL_DASHBOARD_URL:
      process.env.NEXT_PUBLIC_CAL_DASHBOARD_URL,
  };
  return envVars[envKey] || fallback;
}

export default async function AdminHubPage() {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-[#0B0F19]">
      <AdminHeader />

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">Centre de commande</h1>
          <p className="mt-2 text-sm text-white/50">
            Accédez rapidement à tous vos outils d&apos;administration.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid gap-5 sm:grid-cols-2">
          {cards.map((card) => (
            <AdminHubCard
              key={card.envKey}
              title={card.title}
              description={card.description}
              href={getUrl(card.envKey, card.fallback)}
              icon={card.icon}
              accentColor={card.accentColor}
              accentBorder={card.accentBorder}
              accentGlow={card.accentGlow}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
