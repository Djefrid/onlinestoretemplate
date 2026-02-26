import { getCategories } from "@/lib/sanity/queries";
import { mockCategories } from "@/lib/mock-data";
import { BentoGridClient } from "./BentoGridClient";
import type { Category } from "@/types";

async function fetchCategories(): Promise<Category[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return mockCategories;
  try {
    const cats = await getCategories();
    return cats.length > 0 ? cats : mockCategories;
  } catch {
    return mockCategories;
  }
}

export async function BentoGrid() {
  const categories = await fetchCategories();
  return <BentoGridClient categories={categories} />;
}
