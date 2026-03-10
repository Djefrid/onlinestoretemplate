"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cart/store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useShippingConfig } from "@/lib/shipping/useShippingConfig";

export function CartSummary() {
  const subtotal = useCartStore((s) => s.subtotal());
  const totalItems = useCartStore((s) => s.totalItems());
  const { shippingCost, freeShippingThreshold } = useShippingConfig();

  const shippingFree = subtotal >= freeShippingThreshold;
  const shipping = shippingFree ? 0 : shippingCost;
  const total = subtotal + shipping;

  return (
    <div className="rounded-2xl border border-foreground/5 bg-card p-6">
      <h2 className="font-display text-lg font-bold">Résumé</h2>

      <div className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-foreground/60">
            Sous-total ({totalItems} article{totalItems !== 1 && "s"})
          </span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-foreground/60">Livraison</span>
          <span className="font-medium">
            {shippingFree ? (
              <span className="text-green-600">Gratuite</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>

        {!shippingFree && (
          <p className="text-xs text-foreground/40">
            Livraison gratuite à partir de {formatPrice(freeShippingThreshold)}
          </p>
        )}

        <div className="border-t border-foreground/5 pt-3">
          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span className="text-primary">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button asChild size="lg" className="w-full">
          <Link href="/checkout">Passer la commande</Link>
        </Button>
      </div>

      <p className="mt-4 text-center text-xs text-foreground/40">
        Paiement sécurisé par Stripe
      </p>
    </div>
  );
}
