import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, MessageCircle, CalendarDays } from "lucide-react";
import { getSiteSettings } from "@/lib/sanity/siteSettings";

export const metadata: Metadata = {
  title: "Nous contacter",
  description:
    "Contactez l'équipe de l'épicerie africaine par email, téléphone ou WhatsApp. Nous vous répondons sous 24 à 48 heures.",
};

export default async function ContactPage() {
  const s = await getSiteSettings();

  const email = s.email || null;
  const phone = s.phone || null;
  const whatsapp = s.whatsapp || null;
  const hours = s.openingHours || null;
  const addr = s.address;
  const fullAddress = addr?.line1
    ? [addr.line1, addr.line2, [addr.city, addr.province, addr.postalCode].filter(Boolean).join(" ")]
        .filter(Boolean)
        .join(", ")
    : null;

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.08] px-4 py-1.5 text-sm font-medium text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Contact
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Nous contacter
          </h1>
          <p className="mt-3 text-foreground/55">
            Une question, une commande spéciale ou un renseignement ?<br />
            Notre équipe vous répond sous 24 à 48 heures.
          </p>
        </div>

        {/* Cartes de contact */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Email */}
          {email && (
            <a
              href={`mailto:${email}`}
              className="group flex items-start gap-4 rounded-2xl border border-foreground/[0.08] bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_4px_20px_-4px_hsl(249,62%,60%,0.15)]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/[0.08]">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
                  Email
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground group-hover:text-primary">
                  {email}
                </p>
                <p className="mt-0.5 text-xs text-foreground/50">
                  Réponse sous 24–48 h
                </p>
              </div>
            </a>
          )}

          {/* Téléphone */}
          {phone && (
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="group flex items-start gap-4 rounded-2xl border border-foreground/[0.08] bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_4px_20px_-4px_hsl(249,62%,60%,0.15)]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                <Phone className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
                  Téléphone
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground group-hover:text-emerald-600">
                  {phone}
                </p>
                <p className="mt-0.5 text-xs text-foreground/50">
                  Pendant les heures d&apos;ouverture
                </p>
              </div>
            </a>
          )}

          {/* WhatsApp */}
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp.replace(/[^+\d]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 rounded-2xl border border-foreground/[0.08] bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#25D366]/30 hover:shadow-[0_4px_20px_-4px_rgba(37,211,102,0.15)]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/10">
                <MessageCircle className="h-5 w-5 text-[#25D366]" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
                  WhatsApp
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground group-hover:text-[#25D366]">
                  {whatsapp}
                </p>
                <p className="mt-0.5 text-xs text-foreground/50">
                  Réponse rapide
                </p>
              </div>
            </a>
          )}

          {/* Adresse */}
          {fullAddress && (
            <div className="flex items-start gap-4 rounded-2xl border border-foreground/[0.08] bg-white p-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50">
                <MapPin className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
                  Adresse
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {fullAddress}
                </p>
                {addr?.city && (
                  <p className="mt-0.5 text-xs text-foreground/50">
                    {[addr.city, addr.province].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Horaires */}
          {hours && (
            <div className="flex items-start gap-4 rounded-2xl border border-foreground/[0.08] bg-white p-6 sm:col-span-2">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50">
                <Clock className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
                  Horaires d&apos;ouverture
                </p>
                <p className="mt-1 whitespace-pre-line text-sm font-semibold text-foreground">
                  {hours}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Rendez-vous CTA */}
        <div className="mt-10 flex items-start gap-5 rounded-2xl bg-primary/[0.06] px-6 py-6 sm:items-center sm:px-8 sm:py-7">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/[0.12]">
            <CalendarDays className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground">
              Préférez-vous un rendez-vous ?
            </p>
            <p className="mt-1 text-sm text-foreground/60">
              Réservez un créneau pour une consultation personnalisée, une
              dégustation ou un retrait de commande.
            </p>
          </div>
          <Link
            href="/appointments"
            className="hidden shrink-0 items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 sm:inline-flex"
          >
            Prendre RDV
          </Link>
        </div>
        <div className="mt-3 sm:hidden">
          <Link
            href="/appointments"
            className="flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Prendre rendez-vous
          </Link>
        </div>

        {/* FAQ link */}
        <p className="mt-10 text-center text-sm text-foreground/50">
          Consultez aussi notre{" "}
          <Link href="/faq" className="text-primary underline hover:no-underline">
            page FAQ
          </Link>{" "}
          pour les réponses aux questions fréquentes.
        </p>
      </div>
    </div>
  );
}
