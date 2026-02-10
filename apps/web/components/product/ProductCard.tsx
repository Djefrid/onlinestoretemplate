"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { useCartStore } from "@/lib/cart/store";
import { formatPrice } from "@/lib/utils";
import { urlFor } from "@/lib/sanity/image";
import type { Product, Tag } from "@/types";

const tagVariant: Record<Tag, "bio" | "spicy" | "frozen"> = {
  Bio: "bio",
  Pimenté: "spicy",
  Surgelé: "frozen",
};

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="group relative flex flex-col">
      {/* Image area */}
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-square overflow-hidden rounded-2xl bg-foreground/5"
      >
        {product.images && product.images.length > 0 ? (
          <Image
            src={urlFor(product.images[0]).width(500).height(500).url()}
            alt={product.title}
            width={500}
            height={500}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/5 to-accent/10 text-5xl transition-transform duration-500 group-hover:scale-105">
            {product.tags.includes("Pimenté")
              ? "🌶️"
              : product.tags.includes("Surgelé")
                ? "🧊"
                : product.tags.includes("Bio")
                  ? "🌿"
                  : "🛒"}
          </div>
        )}

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <Badge key={tag} variant={tagVariant[tag]}>
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </Link>

      {/* Floating add button */}
      <button
        onClick={() => addItem(product)}
        className="absolute bottom-[4.5rem] right-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white shadow-lg transition-all hover:bg-accent-dark hover:shadow-xl active:scale-95"
        aria-label={`Ajouter ${product.title} au panier`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>

      {/* Info */}
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link
            href={`/product/${product.slug}`}
            className="block truncate text-sm font-medium transition-colors hover:text-accent"
          >
            {product.title}
          </Link>
          <p className="mt-0.5 text-xs text-foreground/50">
            {product.originCountry}
          </p>
        </div>
        <p className="shrink-0 text-sm font-semibold">
          {formatPrice(product.price, product.currency)}
        </p>
      </div>
    </div>
  );
}
