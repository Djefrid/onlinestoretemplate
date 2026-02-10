import type { Metadata } from "next";
import { Suspense } from "react";
import { getProducts, getCategories } from "@/lib/sanity/queries";
import { mockCategories, filterMockProducts } from "@/lib/mock-data";
import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductGrid } from "@/components/product/ProductGrid";
import type { Product, Category } from "@/types";

export const metadata: Metadata = {
  title: "Boutique",
  description:
    "Découvrez notre sélection d'épices, produits frais et soins naturels importés d'Afrique.",
};

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    tag?: string | string[];
    minPrice?: string;
    maxPrice?: string;
    q?: string;
    sort?: string;
  }>;
}

async function fetchData(filters: {
  category?: string;
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
}): Promise<{ products: Product[]; categories: Category[] }> {
  // Try Sanity, fall back to mock data if not configured
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return {
      products: filterMockProducts(filters),
      categories: mockCategories,
    };
  }

  try {
    const [products, categories] = await Promise.all([
      getProducts(filters),
      getCategories(),
    ]);
    return { products, categories };
  } catch {
    console.warn("[shop] Sanity fetch failed, using mock data");
    return {
      products: filterMockProducts(filters),
      categories: mockCategories,
    };
  }
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  const tags = params.tag
    ? Array.isArray(params.tag)
      ? params.tag
      : [params.tag]
    : undefined;

  const filters = {
    category: params.category,
    tags,
    minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
    search: params.q,
    sort: params.sort,
  };

  const { products, categories } = await fetchData(filters);

  return (
    <div className="container-page section-padding">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Boutique
        </h1>
        <p className="mt-2 text-foreground/60">
          {products.length} produit{products.length !== 1 && "s"}
        </p>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row">
        {/* Sidebar */}
        <div className="w-full shrink-0 lg:w-64">
          <Suspense fallback={null}>
            <ProductFilters categories={categories} />
          </Suspense>
        </div>

        {/* Grid */}
        <div className="flex-1">
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}
