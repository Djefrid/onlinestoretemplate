import Link from "next/link";
import type { SiteSettings } from "@/types";

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

interface FooterProps {
  settings: SiteSettings;
}

export function Footer({ settings }: FooterProps) {
  const addr = settings.address;
  const hasAddress = addr && (addr.line1 || addr.city);
  const hasContact = settings.email || settings.phone;
  const hasSocials = settings.socials && Object.values(settings.socials).some(Boolean);

  return (
    <footer className="border-t border-foreground/5 bg-white">
      <div className="container-page section-padding">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand + Contact */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden="true">
                🌍
              </span>
              <span className="font-display text-lg font-bold">
                {settings.shopName}
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-foreground/60">
              {settings.tagline ||
                "L\u2019Afrique authentique, livrée à votre porte. Épices, produits frais et soins naturels importés directement du continent."}
            </p>

            {/* Contact info */}
            {hasContact && (
              <div className="mt-4 space-y-1.5 text-sm text-foreground/60">
                {settings.email && (
                  <p>
                    <a
                      href={`mailto:${settings.email}`}
                      className="hover:text-accent"
                    >
                      {settings.email}
                    </a>
                  </p>
                )}
                {settings.phone && (
                  <p>
                    <a
                      href={`tel:${settings.phone.replace(/\s/g, "")}`}
                      className="hover:text-accent"
                    >
                      {settings.phone}
                    </a>
                  </p>
                )}
                {settings.whatsapp && (
                  <p>
                    <a
                      href={`https://wa.me/${settings.whatsapp.replace(/[^+\d]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-accent"
                    >
                      WhatsApp
                    </a>
                  </p>
                )}
              </div>
            )}

            {/* Address */}
            {hasAddress && (
              <div className="mt-3 text-sm text-foreground/50">
                {addr.line1 && <p>{addr.line1}</p>}
                {addr.line2 && <p>{addr.line2}</p>}
                <p>
                  {[addr.city, addr.province, addr.postalCode]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                {addr.country && <p>{addr.country}</p>}
                {addr.googleMapsUrl && (
                  <a
                    href={addr.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-accent hover:underline"
                  >
                    Voir sur Google Maps
                  </a>
                )}
              </div>
            )}

            {/* Opening hours */}
            {settings.openingHours && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
                  Horaires
                </p>
                <p className="mt-1.5 whitespace-pre-line text-sm text-foreground/50">
                  {settings.openingHours}
                </p>
              </div>
            )}

            {/* Social links */}
            {hasSocials && (
              <div className="mt-4 flex gap-3">
                {settings.socials!.instagram && (
                  <a
                    href={settings.socials!.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="text-foreground/40 hover:text-accent"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </a>
                )}
                {settings.socials!.facebook && (
                  <a
                    href={settings.socials!.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="text-foreground/40 hover:text-accent"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                )}
                {settings.socials!.tiktok && (
                  <a
                    href={settings.socials!.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="text-foreground/40 hover:text-accent"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                    </svg>
                  </a>
                )}
                {settings.socials!.youtube && (
                  <a
                    href={settings.socials!.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="text-foreground/40 hover:text-accent"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                )}
              </div>
            )}
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
            &copy; {new Date().getFullYear()} {settings.shopName}. Tous droits
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
