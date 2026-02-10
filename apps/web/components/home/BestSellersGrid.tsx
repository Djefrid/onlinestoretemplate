"use client";

import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/types";

interface BestSellersGridProps {
  products: Product[];
}

export function BestSellersGrid({ products }: BestSellersGridProps) {
  return (
    <section className="section-padding bg-white">
      <div className="container-page">
        {/* Section header */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Best-sellers
            </h2>
            <p className="mt-3 text-foreground/60">
              Les produits préférés de nos clients
            </p>
          </div>
          <Button href="/shop" variant="ghost" size="sm" className="hidden sm:flex">
            Voir tout
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
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </Button>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center sm:hidden">
          <Button href="/shop" variant="outline" size="md">
            Voir toute la boutique
          </Button>
        </div>
      </div>
    </section>
  );
}
