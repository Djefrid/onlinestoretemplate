import { getFeaturedProducts } from "@/lib/sanity/queries";
import { mockProducts } from "@/lib/mock-data";
import { BestSellersGrid } from "./BestSellersGrid";
import type { Product } from "@/types";

async function getFeatured(): Promise<Product[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return mockProducts.filter((p) => p.isFeatured).slice(0, 8);
  }
  try {
    const products = await getFeaturedProducts();
    return products.length > 0
      ? products
      : mockProducts.filter((p) => p.isFeatured).slice(0, 8);
  } catch {
    return mockProducts.filter((p) => p.isFeatured).slice(0, 8);
  }
}

export async function BestSellers() {
  const products = await getFeatured();

  return <BestSellersGrid products={products} />;
}
