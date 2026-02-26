"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Check } from "lucide-react";
import { useCartStore } from "@/lib/cart/store";
import { useCartUiStore } from "@/lib/cart/uiStore";
import type { Product } from "@/types";

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartUiStore((s) => s.openCart);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, quantity);
    openCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const disabled = product.stock <= 0;

  return (
    <div className="flex items-center gap-3">
      {/* Quantity selector */}
      <div className="flex items-center rounded-full border border-foreground/10 bg-foreground/[0.03]">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="flex h-11 w-11 items-center justify-center text-lg text-foreground/50 transition-colors hover:text-foreground disabled:opacity-25"
          disabled={quantity <= 1}
          aria-label="Diminuer la quantité"
        >
          −
        </button>
        <span className="w-8 text-center text-sm font-semibold tabular-nums">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
          className="flex h-11 w-11 items-center justify-center text-lg text-foreground/50 transition-colors hover:text-foreground disabled:opacity-25"
          disabled={quantity >= product.stock}
          aria-label="Augmenter la quantité"
        >
          +
        </button>
      </div>

      {/* CTA */}
      <motion.button
        onClick={handleAdd}
        disabled={disabled}
        whileTap={!disabled ? { scale: 0.97 } : undefined}
        whileHover={!disabled ? { scale: 1.02 } : undefined}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={[
          "flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors duration-300",
          added
            ? "bg-green-600 shadow-green-500/20"
            : disabled
              ? "cursor-not-allowed bg-foreground/20 shadow-none"
              : "bg-primary shadow-primary/25",
        ].join(" ")}
      >
        {added ? (
          <>
            <Check className="h-4 w-4" />
            Ajouté !
          </>
        ) : disabled ? (
          "Rupture de stock"
        ) : (
          <>
            <ShoppingBag className="h-4 w-4" />
            Ajouter au panier
          </>
        )}
      </motion.button>
    </div>
  );
}
