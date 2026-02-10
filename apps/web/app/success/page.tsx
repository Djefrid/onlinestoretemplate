import Link from "next/link";
import { stripe } from "@/lib/stripe/server";
import { formatPrice } from "@/lib/utils";

interface SuccessPageProps {
  searchParams: { session_id?: string };
}

export const metadata = {
  title: "Commande confirmée — Épicerie Africaine",
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const sessionId = searchParams.session_id;

  let session = null;
  let lineItems = null;

  if (sessionId) {
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
      lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
        limit: 100,
      });
    } catch {
      // Session not found or Stripe not configured
    }
  }

  const deliveryMode = session?.metadata?.deliveryMode || "delivery";
  const customerName = session?.metadata?.customerName || "";

  return (
    <main className="container-page flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <div className="mx-auto max-w-lg">
        {/* Success icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-10 w-10 text-green-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>

        <h1 className="font-display text-3xl font-bold">
          Merci{customerName ? `, ${customerName}` : ""} !
        </h1>

        <p className="mt-3 text-foreground/60">
          Votre commande a été confirmée et le paiement a été traité avec
          succès.
        </p>

        {/* Delivery info */}
        <div className="mt-6 rounded-xl border border-foreground/10 bg-white p-4 text-sm">
          {deliveryMode === "pickup" ? (
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏪</span>
              <div className="text-left">
                <p className="font-medium">Ramassage en magasin</p>
                {session?.metadata?.pickupSlot && (
                  <p className="text-foreground/60">
                    Créneau : {session.metadata.pickupSlot}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚚</span>
              <div className="text-left">
                <p className="font-medium">Livraison à domicile</p>
                {session?.metadata?.addressLine1 && (
                  <p className="text-foreground/60">
                    {session.metadata.addressLine1},{" "}
                    {session.metadata.addressCity}{" "}
                    {session.metadata.addressPostalCode}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        {lineItems && lineItems.data.length > 0 && (
          <div className="mt-4 rounded-xl border border-foreground/10 bg-white p-4">
            <h2 className="mb-3 text-left text-sm font-bold">
              Récapitulatif
            </h2>
            <ul className="space-y-2 text-left text-sm">
              {lineItems.data.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span className="text-foreground/70">
                    {item.description}{" "}
                    <span className="text-foreground/40">
                      &times;{item.quantity}
                    </span>
                  </span>
                  <span className="font-medium">
                    {formatPrice((item.amount_total || 0) / 100)}
                  </span>
                </li>
              ))}
            </ul>
            {session?.amount_total != null && (
              <div className="mt-3 border-t border-foreground/5 pt-3">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-accent">
                    {formatPrice(session.amount_total / 100)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* If no session data, show generic message */}
        {!session && (
          <div className="mt-6 rounded-xl border border-foreground/10 bg-white p-4 text-sm text-foreground/60">
            Un email de confirmation vous sera envoyé sous peu.
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-white transition-colors hover:bg-accent-dark"
          >
            Continuer mes achats
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-foreground/10 px-6 py-3 font-medium transition-colors hover:bg-foreground/5"
          >
            Retour à l&apos;accueil
          </Link>
        </div>

        {/* Session reference */}
        {sessionId && (
          <p className="mt-6 text-xs text-foreground/30">
            Réf. : {sessionId.slice(0, 24)}...
          </p>
        )}
      </div>
    </main>
  );
}
