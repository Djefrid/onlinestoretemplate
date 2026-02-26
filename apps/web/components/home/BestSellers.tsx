import { Suspense } from "react";
import { getBestSellers } from "@/lib/sanity/queries";
import { mockProducts } from "@/lib/mock-data";
import { BestSellersGrid } from "./BestSellersGrid";
import { BestSellersSkeleton } from "./BestSellersSkeleton";
import type { Product } from "@/types";

async function getProducts(): Promise<Product[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return mockProducts.filter((p) => p.isFeatured).slice(0, 8);
  }
  try {
    const products = await getBestSellers();
    return products.length > 0
      ? products
      : mockProducts.filter((p) => p.isFeatured).slice(0, 8);
  } catch {
    return mockProducts.filter((p) => p.isFeatured).slice(0, 8);
  }
}

async function BestSellersContent() {
  const products = await getProducts();
  if (products.length === 0) return null;
  return <BestSellersGrid products={products} />;
}

export function BestSellers() {
  return (
    <Suspense fallback={<BestSellersSkeleton />}>
      <BestSellersContent />
    </Suspense>
  );
}
