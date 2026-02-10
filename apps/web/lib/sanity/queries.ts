import { sanityClient, isSanityConfigured } from "./client";
import type { Product, Category } from "@/types";

function assertConfigured() {
  if (!isSanityConfigured) {
    throw new Error("Sanity is not configured (NEXT_PUBLIC_SANITY_PROJECT_ID missing)");
  }
}

/* ── Fragments ────────────────────────── */

const productFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  price,
  currency,
  images,
  tags,
  originCountry,
  spicyLevel,
  isFrozen,
  isOrganic,
  stock,
  isFeatured,
  category->{_id, title, "slug": slug.current}
`;

/* ── Categories ───────────────────────── */

export async function getCategories(): Promise<Category[]> {
  assertConfigured();
  return sanityClient.fetch(
    /* groq */ `*[_type == "category"] | order(order asc) {
      _id, title, "slug": slug.current, description, image, order
    }`,
    {},
    { next: { revalidate: 60 } },
  );
}

/* ── Products (shop listing with filters) ─ */

interface ProductFilters {
  category?: string;
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  assertConfigured();
  const conditions: string[] = ['_type == "product"'];
  const params: Record<string, unknown> = {};

  if (filters.category) {
    conditions.push('category->slug.current == $category');
    params.category = filters.category;
  }

  if (filters.tags && filters.tags.length > 0) {
    conditions.push('count((tags[])[@ in $tags]) > 0');
    params.tags = filters.tags;
  }

  if (filters.minPrice != null) {
    conditions.push("price >= $minPrice");
    params.minPrice = filters.minPrice;
  }

  if (filters.maxPrice != null) {
    conditions.push("price <= $maxPrice");
    params.maxPrice = filters.maxPrice;
  }

  if (filters.search) {
    conditions.push("[title, originCountry] match $search");
    params.search = `${filters.search}*`;
  }

  let ordering = "| order(_createdAt desc)";
  if (filters.sort === "price-asc") ordering = "| order(price asc)";
  else if (filters.sort === "price-desc") ordering = "| order(price desc)";
  else if (filters.sort === "name") ordering = "| order(title asc)";

  const query = /* groq */ `*[${conditions.join(" && ")}] ${ordering} {
    ${productFields}
  }`;

  return sanityClient.fetch(query, params, { next: { revalidate: 60 } });
}

/* ── Featured products (home) ─────────── */

export async function getFeaturedProducts(): Promise<Product[]> {
  assertConfigured();
  return sanityClient.fetch(
    /* groq */ `*[_type == "product" && isFeatured == true] | order(_createdAt desc) [0...8] {
      ${productFields}
    }`,
    {},
    { next: { revalidate: 60 } },
  );
}

/* ── Single product by slug ───────────── */

export async function getProductBySlug(slug: string): Promise<Product | null> {
  assertConfigured();
  return sanityClient.fetch(
    /* groq */ `*[_type == "product" && slug.current == $slug][0] {
      ${productFields},
      description,
      relatedProducts[]->{${productFields}}
    }`,
    { slug },
    { next: { revalidate: 60 } },
  );
}

/* ── All product slugs (for static generation) ── */

export async function getAllProductSlugs(): Promise<string[]> {
  assertConfigured();
  return sanityClient.fetch(
    /* groq */ `*[_type == "product"].slug.current`,
    {},
    { next: { revalidate: 60 } },
  );
}
