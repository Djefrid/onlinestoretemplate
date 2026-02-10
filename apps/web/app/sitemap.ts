import type { MetadataRoute } from "next";
import { getAllProductSlugs } from "@/lib/sanity/queries";
import { isSanityConfigured } from "@/lib/sanity/client";
import { mockProducts } from "@/lib/mock-data";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3007";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/appointments`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/cart`, lastModified: new Date(), changeFrequency: "always", priority: 0.3 },
    { url: `${BASE_URL}/legal/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/legal/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/legal/refunds`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/legal/imprint`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
  ];

  // Product pages
  let slugs: string[] = [];
  if (isSanityConfigured) {
    try {
      slugs = await getAllProductSlugs();
    } catch {
      slugs = mockProducts.map((p) => p.slug);
    }
  } else {
    slugs = mockProducts.map((p) => p.slug);
  }

  const productPages: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE_URL}/product/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...productPages];
}
