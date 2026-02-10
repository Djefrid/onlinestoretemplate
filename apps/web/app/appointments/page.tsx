"use client";

import { useEffect, useRef } from "react";

const CALCOM_URL = process.env.NEXT_PUBLIC_CALCOM_EMBED_URL;

export default function AppointmentsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (!CALCOM_URL || loaded.current) return;
    loaded.current = true;

    const script = document.createElement("script");
    script.src = "https://app.cal.com/embed/embed.js";
    script.async = true;
    script.onload = () => {
      // @ts-expect-error Cal is injected by the embed script
      if (typeof window.Cal === "function") {
        // @ts-expect-error Cal is injected by the embed script
        window.Cal("init");
        // @ts-expect-error Cal is injected by the embed script
        window.Cal("inline", {
          elementOrSelector: containerRef.current,
          calLink: CALCOM_URL,
          layout: "month_view",
        });
        // @ts-expect-error Cal is injected by the embed script
        window.Cal("ui", {
          styles: { branding: { brandColor: "#CCA43B" } },
          hideEventTypeDetails: false,
          layout: "month_view",
        });
      }
    };
    document.head.appendChild(script);
  }, []);

  if (!CALCOM_URL) {
    return (
      <div className="container-page py-20 text-center">
        <div className="mx-auto max-w-lg">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
            <span className="text-4xl">📅</span>
          </div>
          <h1 className="font-display text-3xl font-bold">Prendre rendez-vous</h1>
          <p className="mt-4 text-foreground/60">
            Le système de réservation est en cours de configuration.
            Contactez-nous directement pour prendre rendez-vous.
          </p>
          <a
            href="mailto:contact@epicerie-africaine.ca"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-white transition-colors hover:bg-accent-dark"
          >
            Nous contacter
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Prendre rendez-vous
        </h1>
        <p className="mt-3 text-foreground/60">
          Réservez un créneau pour une consultation personnalisée ou un retrait
          de commande.
        </p>
      </div>
      <div
        ref={containerRef}
        className="mx-auto min-h-[600px] max-w-3xl overflow-hidden rounded-2xl border border-foreground/5 bg-white"
      />
    </div>
  );
}
