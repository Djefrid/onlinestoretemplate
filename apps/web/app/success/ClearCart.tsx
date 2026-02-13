"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/cart/store";

/**
 * Client component that clears the local cart after a successful checkout.
 */
export function ClearCart() {
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return null;
}
