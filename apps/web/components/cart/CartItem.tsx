"use client";

import Image from "next/image";
import { useCartStore } from "@/lib/cart/store";
import { formatPrice } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/types";

/**
 * Build a Sanity CDN image URL from a _ref string.
 * Ref format: "image-{id}-{WxH}-{ext}"
 */
function sanityImageUrl(ref: string, width = 200): string | null {
  const match = ref.match(/^image-(.+)-(\d+x\d+)-(\w+)$/);
  if (!match) return null;
  const [, id, dims, ext] = match;
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  if (!projectId) return null;
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dims}.${ext}?w=${width}&h=${width}&fit=crop`;
}

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const imageUrl = item.image ? sanityImageUrl(item.image) : null;

  return (
    <div className="flex gap-4 py-6">
      {imageUrl ? (
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-foreground/5">
          <Image
            src={imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
      ) : (
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-foreground/5 text-3xl">
          🛒
        </div>
      )}

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between">
          <div>
            <h3 className="text-sm font-medium">{item.name}</h3>
            <p className="mt-0.5 text-xs text-foreground/50">
              {formatPrice(item.price, item.currency)} / unité
            </p>
          </div>
          <p className="text-sm font-semibold">
            {formatPrice(item.price * item.quantity, item.currency)}
          </p>
        </div>

        <div className="flex items-center justify-between">
          {/* Quantity controls */}
          <div className="flex items-center rounded-full border border-foreground/10">
            <button
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              className="flex h-8 w-8 items-center justify-center text-sm text-foreground/60 hover:text-foreground"
              aria-label="Diminuer"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              className="flex h-8 w-8 items-center justify-center text-sm text-foreground/60 hover:text-foreground"
              aria-label="Augmenter"
            >
              +
            </button>
          </div>

          {/* Remove */}
          <button
            onClick={() => removeItem(item.productId)}
            className="text-xs text-foreground/40 underline underline-offset-2 hover:text-red-500"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
