"use client";

import { useEffect, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

const CALCOM_URL = process.env.NEXT_PUBLIC_CALCOM_EMBED_URL!;

export function CalEmbedClient() {
  const [calReady, setCalReady] = useState(false);

  useEffect(() => {
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

  return (
    <div className="w-full max-w-4xl">
      <Cal
        namespace="consultation"
        calLink={CALCOM_URL}
        config={{ layout: "month_view", theme: "light" }}
        style={{ width: "100%", height: "100%", overflow: "scroll", minHeight: "600px" }}
      />
      {!calReady && (
        <div className="mt-4 text-sm text-foreground/40">
          Chargement du calendrier…
        </div>
      )}
    </div>
  );
}
