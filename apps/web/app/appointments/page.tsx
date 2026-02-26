import { getSiteSettings } from "@/lib/sanity/siteSettings";
import { CalEmbedClient } from "./CalEmbedClient";

const CALCOM_URL = process.env.NEXT_PUBLIC_CALCOM_EMBED_URL;

export const metadata = {
  title: "Prendre rendez-vous",
};

export default async function AppointmentsPage() {
  const s = await getSiteSettings();
  const email = s.email || "contact@epicerie-africaine.ca";

  if (!CALCOM_URL) {
    return (
      <div className="container-page section-padding text-center">
        <div className="mx-auto max-w-lg">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
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
            href={`mailto:${email}`}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary/90"
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
      <CalEmbedClient />
    </div>
  );
}
