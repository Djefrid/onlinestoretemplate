"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { useCartStore } from "@/lib/cart/store";
import { useCartUiStore } from "@/lib/cart/uiStore";
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
  const openCart = useCartUiStore((s) => s.openCart);

  return (
    <div className="group overflow-hidden rounded-2xl bg-[#F2F2F2] shadow-[0_2px_8px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.03] transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
      {/* Image area — ratio 4:3 */}
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-foreground/5"
      >
        {product.images && product.images.length > 0 ? (
          <Image
            src={urlFor(product.images[0]).width(600).height(450).url()}
            alt={product.title}
            width={600}
            height={450}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 text-5xl transition-transform duration-500 group-hover:scale-105">
            {product.tags.includes("Pimenté")
              ? "🌶️"
              : product.tags.includes("Surgelé")
                ? "🧊"
                : product.tags.includes("Bio")
                  ? "🌿"
                  : "🛒"}
          </div>
        )}

        {/* Quick view overlay */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/20">
          <span className="translate-y-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-foreground opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            Aperçu rapide
          </span>
        </div>

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

        {/* Badge (depuis Sanity ou fallback isFeatured) */}
        {(product.badge || product.isFeatured) && (
          <span className="absolute right-3 top-3 rounded-full bg-foreground/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
            {product.badge || "Populaire"}
          </span>
        )}

        {/* Add to cart button on image */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            addItem(product);
            openCart();
          }}
          className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-md transition-all duration-300 hover:scale-110 hover:rotate-90 hover:bg-primary-dark hover:shadow-lg active:scale-95"
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
      </Link>

      {/* Info */}
      <div className="p-4 sm:p-5">
        {/* Title + Price */}
        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/product/${product.slug}`}
            className="truncate text-base font-bold text-foreground transition-colors hover:text-primary"
          >
            {product.title}
          </Link>
          <span className="shrink-0 font-display text-base font-bold text-foreground">
            {formatPrice(product.price, product.currency)}
          </span>
        </div>

        {/* Origin */}
        {product.originCountry && (
          <p className="mt-1 text-xs text-foreground/50">
            {product.originCountry}
          </p>
        )}
      </div>
    </div>
  );
}

/* Skeleton placeholder for loading state */
export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="aspect-[4/3] animate-pulse bg-foreground/5" />
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="h-4 w-2/3 animate-pulse rounded bg-foreground/10" />
          <div className="h-4 w-16 animate-pulse rounded bg-foreground/10" />
        </div>
        <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-foreground/5" />
      </div>
    </div>
  );
}
