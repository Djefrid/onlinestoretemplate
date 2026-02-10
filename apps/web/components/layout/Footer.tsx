import Link from "next/link";

const footerLinks = {
  Boutique: [
    { label: "Catalogue", href: "/shop" },
    { label: "Épices", href: "/shop?category=epices" },
    { label: "Produits frais", href: "/shop?category=frais" },
    { label: "Soins", href: "/shop?category=soins" },
  ],
  Services: [
    { label: "Prendre rendez-vous", href: "/appointments" },
    { label: "Livraison", href: "/legal/terms#livraison" },
  ],
  Légal: [
    { label: "CGV", href: "/legal/terms" },
    { label: "Confidentialité", href: "/legal/privacy" },
    { label: "Retours", href: "/legal/refunds" },
    { label: "Mentions légales", href: "/legal/imprint" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-foreground/5 bg-white">
      <div className="container-page section-padding">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden="true">
                🌍
              </span>
              <span className="font-display text-lg font-bold">
                Épicerie Africaine
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-foreground/60">
              L&apos;Afrique authentique, livrée à votre porte. Épices,
              produits frais et soins naturels importés directement du
              continent.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/40">
                {title}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/60 transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-foreground/5 pt-8 sm:flex-row">
          <p className="text-xs text-foreground/40">
            &copy; {new Date().getFullYear()} Épicerie Africaine. Tous droits
            réservés.
          </p>
          <p className="text-xs text-foreground/40">
            Paiements sécurisés par Stripe
          </p>
        </div>
      </div>
    </footer>
  );
}
