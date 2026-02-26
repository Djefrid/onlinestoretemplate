"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Check } from "lucide-react";
import { useCartStore } from "@/lib/cart/store";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";

interface MobileStickyBarProps {
  product: Product;
}

export function MobileStickyBar({ product }: MobileStickyBarProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const disabled = product.stock <= 0;

  const handleAdd = () => {
    if (disabled) return;
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ y: 96, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 22, stiffness: 200, delay: 0.6 }}
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
    >
      <div className="flex items-center gap-3 border-t border-foreground/[0.07] bg-background/90 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-xl">
        <div className="shrink-0">
          <p className="text-[10px] uppercase tracking-wider text-foreground/40">Prix</p>
          <p className="font-bold text-primary">{formatPrice(product.price, product.currency)}</p>
        </div>
        <motion.button
          onClick={handleAdd}
          disabled={disabled}
          whileTap={!disabled ? { scale: 0.97 } : undefined}
          className={[
            "flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white transition-colors",
            added
              ? "bg-green-600"
              : disabled
                ? "bg-foreground/20 cursor-not-allowed"
                : "bg-primary shadow-lg shadow-primary/20",
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
    </motion.div>
  );
}
