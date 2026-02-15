"use client";

import { useEffect, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

const CALCOM_URL = process.env.NEXT_PUBLIC_CALCOM_EMBED_URL;

export default function AppointmentsPage() {
  const [calReady, setCalReady] = useState(false);

  useEffect(() => {
    if (!CALCOM_URL) return;
    (async () => {
      const cal = await getCalApi({ namespace: "consultation" });
      cal("ui", {
        theme: "light",
        hideEventTypeDetails: false,
        layout: "month_view",
        cssVarsPerTheme: {
          light: {
            "cal-brand": "#c8102e",
            "cal-brand-emphasis": "#a30d25",
            "cal-brand-text": "#ffffff",
            "cal-border-default": "rgba(0,0,0,0.08)",
          },
          dark: {
            "cal-brand": "#c8102e",
            "cal-brand-emphasis": "#a30d25",
            "cal-brand-text": "#ffffff",
            "cal-border-default": "rgba(255,255,255,0.1)",
          },
        },
      });
      setCalReady(true);
    })();
  }, []);

  if (!CALCOM_URL) {
    return (
      <div className="container-page py-20 text-center">
        <div className="mx-auto max-w-lg">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
            <span className="text-4xl">📅</span>
          </div>
          <h1 className="font-display text-3xl font-bold">
            Prendre rendez-vous
          </h1>
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
    <div className="container-page section-padding flex flex-col items-center">
      <div className="mb-6 text-center">
        <h1 className="font-display text-3xl font-bold">
          Prendre rendez-vous
        </h1>
        <p className="mt-2 text-sm text-foreground/60">
          Réservez un créneau pour une consultation personnalisée ou un retrait
          de commande.
        </p>
      </div>

      <div className="w-full max-w-4xl">
        <Cal
          namespace="consultation"
          calLink={CALCOM_URL}
          config={{
            layout: "month_view",
            theme: "light",
          }}
          style={{
            width: "100%",
            height: "100%",
            overflow: "scroll",
            minHeight: "600px",
          }}
        />
      </div>

      {!calReady && (
        <div className="mt-4 text-sm text-foreground/40">
          Chargement du calendrier...
        </div>
      )}
    </div>
  );
}
