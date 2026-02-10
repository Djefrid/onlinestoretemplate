import Link from "next/link";

export const metadata = {
  title: "Paiement annulé — Épicerie Africaine",
};

export default function CancelPage() {
  return (
    <main className="container-page flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <div className="mx-auto max-w-lg">
        {/* Cancel icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-10 w-10 text-orange-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="font-display text-3xl font-bold">Paiement annulé</h1>

        <p className="mt-3 text-foreground/60">
          Votre paiement a été annulé. Aucun montant n&apos;a été débité de
          votre compte. Votre panier a été conservé.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/checkout"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-white transition-colors hover:bg-accent-dark"
          >
            Réessayer le paiement
          </Link>
          <Link
            href="/cart"
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-foreground/10 px-6 py-3 font-medium transition-colors hover:bg-foreground/5"
          >
            Retour au panier
          </Link>
        </div>

        <p className="mt-6 text-xs text-foreground/40">
          Besoin d&apos;aide ? Contactez-nous à{" "}
          <a
            href="mailto:contact@epicerie-africaine.ca"
            className="underline hover:text-foreground/60"
          >
            contact@epicerie-africaine.ca
          </a>
        </p>
      </div>
    </main>
  );
}
