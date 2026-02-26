"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { ShoppingCart, Star, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/lib/cart/store";
import { useCartUiStore } from "@/lib/cart/uiStore";
import { urlFor } from "@/lib/sanity/image";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/types";

interface BestSellersGridProps {
  products: Product[];
}

/* ── Card produit ──────────────────────────────── */

function BestSellerCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartUiStore((s) => s.openCart);

  // TODO: Brancher sur valeurs dynamiques depuis Supabase reviews
  // Voir GET /api/reviews?product_slug=... — apps/web/app/api/reviews/route.ts
  const rating = product.ratingAverage ?? 4.7;
  const reviewsCount = product.reviewsCount ?? 0;

  const mainImage = product.images?.[0];
  const hoverImage = product.images?.[1];
  const mainUrl = mainImage ? urlFor(mainImage).width(480).height(600).url() : null;
  const hoverUrl = hoverImage ? urlFor(hoverImage).width(480).height(600).url() : null;

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    openCart();
    toast.success("Ajouté au panier !", { description: product.title });
  }

  return (
    <article className="group">
      <Link href={`/product/${product.slug}`} className="block">
        {/* Image container — ratio 4:5 */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-foreground/5">
          {/* Image principale */}
          {mainUrl ? (
            <Image
              src={mainUrl}
              alt={mainImage?.alt ?? product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
              className={[
                "object-cover transition-opacity duration-500",
                hoverUrl ? "group-hover:opacity-0" : "",
              ].join(" ")}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl">🛒</div>
          )}

          {/* Image hover — crossfade */}
          {hoverUrl && (
            <Image
              src={hoverUrl}
              alt={hoverImage?.alt ?? product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
              className="absolute inset-0 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}

          {/* Badge Best-seller */}
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[#6858D8] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-md">
            Best-seller
          </span>

          {/* Quick Add — mobile toujours visible, desktop slide au hover */}
          <button
            type="button"
            onClick={handleQuickAdd}
            className={[
              "absolute bottom-0 left-0 right-0 z-10",
              "flex items-center justify-center gap-2",
              "bg-[#6858D8] py-3 text-sm font-semibold text-white",
              "shadow-[0_-4px_16px_rgba(104,88,216,0.25)]",
              "transition-all duration-300 active:scale-[0.98]",
              // Mobile : toujours visible
              "translate-y-0 opacity-100",
              // Desktop : caché par défaut → slide up au hover
              "lg:translate-y-full lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100",
            ].join(" ")}
            aria-label={`Ajouter ${product.title} au panier`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Ajouter</span>
          </button>
        </div>

        {/* Infos produit */}
        <div className="mt-3 space-y-1 px-0.5">
          {/* Étoiles */}
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={[
                  "h-3.5 w-3.5",
                  i < Math.round(rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-transparent text-foreground/20",
                ].join(" ")}
              />
            ))}
            {reviewsCount > 0 && (
              <span className="ml-1 text-xs text-foreground/50">({reviewsCount})</span>
            )}
          </div>

          {/* Titre */}
          <p className="truncate text-sm font-semibold text-[#1E293B]">{product.title}</p>

          {/* Prix */}
          <p className="text-sm font-bold text-[#6858D8]">
            {formatPrice(product.price, product.currency)}
          </p>
        </div>
      </Link>
    </article>
  );
}

/* ── Section Best-Sellers ──────────────────────── */

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function BestSellersGrid({ products }: BestSellersGridProps) {
  return (
    <section className="section-padding bg-white">
      <div className="container-page">
        {/* Section header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-[#0F172A] sm:text-4xl">
              Best-sellers
            </h2>
            <p className="mt-2 text-sm text-foreground/55">
              Les produits préférés de nos clients
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="hidden gap-1.5 sm:flex">
            <Link href="/shop?sort=bestsellers">
              Voir tout
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Grid avec animation scroll */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4"
        >
          {products.map((product) => (
            <motion.div key={product._id} variants={cardVariants}>
              <BestSellerCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center sm:hidden">
          <Button asChild variant="outline" size="sm">
            <Link href="/shop?sort=bestsellers">Voir toute la boutique</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
