import Image from "next/image";
import { Button } from "@/components/ui/Button";

interface HeroProps {
  heroTitle?: string;
  heroSubtitle?: string;
  bannerUrl?: string;
  bannerAlt?: string;
}

export function Hero({ heroTitle, heroSubtitle, bannerUrl, bannerAlt }: HeroProps) {
  const title = heroTitle || "L\u2019Afrique authentique, livrée à votre porte.";
  const subtitle =
    heroSubtitle ||
    "Épices rares, produits frais et soins naturels importés directement du continent africain.";
  const hasImage = Boolean(bannerUrl);

  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden">
      {/* Background: image or gradient */}
      <div className="absolute inset-0 -z-10">
        {hasImage ? (
          <>
            <Image
              src={bannerUrl!}
              alt={bannerAlt || ""}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/3" />
            <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent/3 blur-3xl" />
          </>
        )}
      </div>

      <div className="container-page w-full">
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow */}
          <p
            className={`mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${
              hasImage ? "bg-white/20 text-white" : "bg-accent/10 text-accent-dark"
            }`}
          >
            <span aria-hidden="true">✦</span>
            Saveurs authentiques d&apos;Afrique
          </p>

          {/* Heading */}
          <h1
            className={`font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl ${
              hasImage ? "text-white" : ""
            }`}
          >
            {title}
          </h1>

          {/* Subtitle */}
          <p
            className={`mx-auto mt-6 max-w-xl text-lg leading-relaxed sm:text-xl ${
              hasImage ? "text-white/80" : "text-foreground/60"
            }`}
          >
            {subtitle}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/shop" size="lg">
              Commander
            </Button>
            <Button href="/appointments" variant="outline" size="lg">
              Réserver un créneau
            </Button>
          </div>

          {/* Trust signals */}
          <div
            className={`mt-16 flex flex-wrap items-center justify-center gap-8 text-sm ${
              hasImage ? "text-white/60" : "text-foreground/40"
            }`}
          >
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              Livraison rapide
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
              Paiement sécurisé
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              Produits authentiques
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
