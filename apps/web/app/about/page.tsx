import { getSiteSettings } from "@/lib/sanity/siteSettings";
import Link from "next/link";
import { Heart, MapPin, Leaf, ShoppingBag, Star, Users } from "lucide-react";

export const metadata = {
  title: "À propos",
  description:
    "Découvrez notre histoire, notre mission et nos valeurs. Une épicerie africaine authentique au cœur du Québec.",
};

export default async function AboutPage() {
  const s = await getSiteSettings();
  const shopName = s.shopName || "Épicerie Africaine";

  return (
    <main className="container-page section-padding">
      {/* Hero */}
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.08] px-4 py-1.5 text-sm font-medium text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Notre histoire
        </span>
        <h1 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          L&apos;Afrique authentique,{" "}
          <span className="text-primary">chez vous</span>
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-foreground/60">
          {shopName} est née d&apos;une passion pour les saveurs, les soins et
          les produits qui font la richesse du continent africain. Nous
          sélectionnons chaque produit avec soin pour vous offrir ce qu&apos;il
          y a de meilleur.
        </p>
      </div>

      {/* Values */}
      <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            icon: Heart,
            title: "Passion & authenticité",
            description:
              "Chaque produit est choisi pour son authenticité et sa qualité. Nous refusons les compromis sur l'origine et la fraîcheur.",
          },
          {
            icon: MapPin,
            title: "Origine traçable",
            description:
              "Nous travaillons directement avec des producteurs et importateurs de confiance pour garantir la provenance de nos produits.",
          },
          {
            icon: Leaf,
            title: "Naturel & sain",
            description:
              "Épices, soins et produits frais sélectionnés pour leurs propriétés naturelles, sans additifs artificiels.",
          },
          {
            icon: ShoppingBag,
            title: "Communauté locale",
            description:
              "Nous sommes fiers de servir la communauté africaine et afro-descendante du Québec avec des produits de qualité.",
          },
          {
            icon: Star,
            title: "Qualité garantie",
            description:
              "Satisfaction ou remboursement. Nous sommes à l'écoute de chaque client pour offrir la meilleure expérience possible.",
          },
          {
            icon: Users,
            title: "Service personnalisé",
            description:
              "Consultations personnalisées disponibles sur rendez-vous pour vous aider à trouver les produits adaptés à vos besoins.",
          },
        ].map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-2xl border border-foreground/5 bg-card p-6 transition-shadow hover:shadow-md"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/[0.08]">
              <Icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/60">
              {description}
            </p>
          </div>
        ))}
      </div>

      {/* Mission statement */}
      <div className="mt-20 rounded-3xl bg-primary/[0.05] border border-primary/10 px-8 py-12 text-center">
        <blockquote className="mx-auto max-w-2xl font-display text-2xl font-semibold leading-relaxed text-foreground sm:text-3xl">
          &ldquo;Notre mission est de rendre accessibles les trésors
          gastronomiques et naturels d&apos;Afrique à chaque foyer
          québécois.&rdquo;
        </blockquote>
        <p className="mt-4 text-sm text-foreground/50">— L&apos;équipe {shopName}</p>
      </div>

      {/* CTAs */}
      <div className="mt-20 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Link
          href="/shop"
          className="inline-flex h-12 items-center gap-2 rounded-2xl bg-primary px-8 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary/90 active:scale-95"
        >
          Découvrir nos produits
        </Link>
        <Link
          href="/appointments"
          className="inline-flex h-12 items-center gap-2 rounded-2xl border border-border bg-card px-8 text-sm font-semibold text-foreground transition-colors hover:border-primary/30 hover:bg-primary/5"
        >
          Prendre rendez-vous
        </Link>
      </div>

      {/* Contact teaser */}
      <div className="mt-12 text-center text-sm text-foreground/40">
        Une question ?{" "}
        <Link href="/contact" className="text-primary underline-offset-2 hover:underline">
          Contactez-nous
        </Link>
      </div>
    </main>
  );
}
