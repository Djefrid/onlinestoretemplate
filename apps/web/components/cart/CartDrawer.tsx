"use client";

import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";

import { useCartStore } from "@/lib/cart/store";
import { useCartUiStore } from "@/lib/cart/uiStore";
import { CartItem } from "./CartItem";
import { Button } from "@/components/ui/Button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatPrice } from "@/lib/utils";

const SHIPPING_COST = parseFloat(process.env.NEXT_PUBLIC_SHIPPING_COST || "5.99");
const FREE_SHIPPING_THRESHOLD = parseFloat(
  process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || "75",
);

export function CartDrawer() {
  const { isCartOpen, closeCart } = useCartUiStore();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const totalItems = useCartStore((s) => s.totalItems());

  const shippingFree = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = shippingFree ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md [&>button:first-child]:hidden"
      >
        {/* Header */}
        <SheetHeader className="flex !flex-row items-center justify-between space-y-0 border-b border-foreground/[0.07] px-6 py-4">
          <SheetTitle className="text-base font-bold">
            Mon panier{totalItems > 0 && ` (${totalItems})`}
          </SheetTitle>
          <button
            onClick={closeCart}
            className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/40 transition-colors hover:bg-foreground/5 hover:text-foreground"
            aria-label="Fermer le panier"
          >
            <X className="h-4 w-4" />
          </button>
        </SheetHeader>

        {items.length === 0 ? (
          /* État vide */
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="h-14 w-14 text-foreground/15" />
            <div>
              <p className="font-semibold">Votre panier est vide</p>
              <p className="mt-1 text-sm text-foreground/50">
                Ajoutez des produits pour commencer.
              </p>
            </div>
            <Button asChild variant="outline" size="sm" onClick={closeCart}>
              <Link href="/produits">Découvrir nos produits</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Liste d'articles (scrollable) */}
            <div className="flex-1 divide-y divide-foreground/[0.06] overflow-y-auto px-6">
              {items.map((item) => (
                <CartItem key={item.productId} item={item} />
              ))}
            </div>

            {/* Footer — totaux + CTA */}
            <div className="border-t border-foreground/[0.07] px-6 pb-8 pt-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-foreground/60">
                  <span>Sous-total</span>
                  <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-foreground/60">
                  <span>Livraison</span>
                  <span className={shippingFree ? "font-medium text-green-600" : "font-medium text-foreground"}>
                    {shippingFree ? "Gratuite" : formatPrice(shipping)}
                  </span>
                </div>
                {!shippingFree && (
                  <p className="text-xs text-foreground/40">
                    Livraison gratuite à partir de {formatPrice(FREE_SHIPPING_THRESHOLD)}
                  </p>
                )}
                <div className="flex justify-between border-t border-foreground/[0.07] pt-3 text-base font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              <Button asChild size="lg" className="mt-4 w-full" onClick={closeCart}>
                <Link href="/checkout">Passer la commande</Link>
              </Button>
              <p className="mt-3 text-center text-xs text-foreground/35">
                Paiement sécurisé par Stripe
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
