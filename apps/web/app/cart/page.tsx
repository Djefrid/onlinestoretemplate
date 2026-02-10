"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cart/store";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  if (items.length === 0) {
    return (
      <div className="container-page section-padding text-center">
        <span className="mb-6 block text-6xl" aria-hidden="true">
          🛒
        </span>
        <h1 className="font-display text-3xl font-bold">
          Votre panier est vide
        </h1>
        <p className="mt-3 text-foreground/60">
          Découvrez nos produits et ajoutez-les à votre panier.
        </p>
        <div className="mt-8">
          <Button href="/shop" size="lg">
            Voir la boutique
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page section-padding">
      {/* Header */}
      <div className="mb-10 flex items-end justify-between">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Panier</h1>
        <button
          onClick={clearCart}
          className="text-sm text-foreground/40 underline underline-offset-2 hover:text-red-500"
        >
          Vider le panier
        </button>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row">
        {/* Items list */}
        <div className="flex-1">
          <div className="divide-y divide-foreground/5">
            {items.map((item) => (
              <CartItem key={item.productId} item={item} />
            ))}
          </div>

          <div className="mt-6">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1 text-sm text-foreground/50 transition-colors hover:text-accent"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
              Continuer les achats
            </Link>
          </div>
        </div>

        {/* Summary sidebar */}
        <div className="w-full shrink-0 lg:w-80">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
