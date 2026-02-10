import type { Product, Category } from "@/types";

export const mockCategories: Category[] = [
  { _id: "cat-1", title: "Épices", slug: "epices", description: "Piments, mélanges et saveurs intenses", order: 1 },
  { _id: "cat-2", title: "Produits Frais", slug: "frais", description: "Feuilles, tubercules et produits frais", order: 2 },
  { _id: "cat-3", title: "Soins & Beauté", slug: "soins", description: "Cosmétiques naturels africains", order: 3 },
];

export const mockProducts: Product[] = [
  {
    _id: "mock-1",
    title: "Piment de Cayenne moulu",
    slug: "piment-cayenne-moulu",
    price: 6.99,
    currency: "CAD",
    images: [],
    tags: ["Pimenté"],
    originCountry: "Cameroun 🇨🇲",
    spicyLevel: 3,
    isFrozen: false,
    isOrganic: false,
    stock: 25,
    isFeatured: true,
    category: mockCategories[0],
  },
  {
    _id: "mock-2",
    title: "Beurre de Karité pur",
    slug: "beurre-karite-pur",
    price: 14.99,
    currency: "CAD",
    images: [],
    tags: ["Bio"],
    originCountry: "Côte d'Ivoire 🇨🇮",
    spicyLevel: 0,
    isFrozen: false,
    isOrganic: true,
    stock: 18,
    isFeatured: true,
    category: mockCategories[2],
  },
  {
    _id: "mock-3",
    title: "Gari blanc premium",
    slug: "gari-blanc-premium",
    price: 8.49,
    currency: "CAD",
    images: [],
    tags: [],
    originCountry: "Nigeria 🇳🇬",
    spicyLevel: 0,
    isFrozen: false,
    isOrganic: false,
    stock: 30,
    isFeatured: true,
    category: mockCategories[1],
  },
  {
    _id: "mock-4",
    title: "Feuilles de Manioc surgelées",
    slug: "feuilles-manioc-surgelees",
    price: 7.99,
    currency: "CAD",
    images: [],
    tags: ["Surgelé"],
    originCountry: "Congo 🇨🇬",
    spicyLevel: 0,
    isFrozen: true,
    isOrganic: false,
    stock: 12,
    isFeatured: true,
    category: mockCategories[1],
  },
  {
    _id: "mock-5",
    title: "Huile de Palme Rouge",
    slug: "huile-palme-rouge",
    price: 11.99,
    currency: "CAD",
    images: [],
    tags: ["Bio"],
    originCountry: "Cameroun 🇨🇲",
    spicyLevel: 0,
    isFrozen: false,
    isOrganic: true,
    stock: 20,
    isFeatured: true,
    category: mockCategories[0],
  },
  {
    _id: "mock-6",
    title: "Bissap séché (Hibiscus)",
    slug: "bissap-seche-hibiscus",
    price: 5.49,
    currency: "CAD",
    images: [],
    tags: ["Bio"],
    originCountry: "Sénégal 🇸🇳",
    spicyLevel: 0,
    isFrozen: false,
    isOrganic: true,
    stock: 35,
    isFeatured: true,
    category: mockCategories[0],
  },
  {
    _id: "mock-7",
    title: "Plantain Chips épicées",
    slug: "plantain-chips-epicees",
    price: 4.99,
    currency: "CAD",
    images: [],
    tags: ["Pimenté"],
    originCountry: "Ghana 🇬🇭",
    spicyLevel: 2,
    isFrozen: false,
    isOrganic: false,
    stock: 40,
    isFeatured: true,
    category: mockCategories[1],
  },
  {
    _id: "mock-8",
    title: "Savon Noir Africain",
    slug: "savon-noir-africain",
    price: 9.99,
    currency: "CAD",
    images: [],
    tags: ["Bio"],
    originCountry: "Ghana 🇬🇭",
    spicyLevel: 0,
    isFrozen: false,
    isOrganic: true,
    stock: 22,
    isFeatured: true,
    category: mockCategories[2],
  },
];

/**
 * Apply filters on mock data (mirrors GROQ query logic).
 */
export function filterMockProducts(
  filters: {
    category?: string;
    tags?: string[];
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sort?: string;
  } = {},
): Product[] {
  let results = [...mockProducts];

  if (filters.category) {
    results = results.filter((p) => p.category?.slug === filters.category);
  }
  if (filters.tags && filters.tags.length > 0) {
    results = results.filter((p) =>
      filters.tags!.some((t) => p.tags.includes(t as Product["tags"][number])),
    );
  }
  if (filters.minPrice != null) {
    results = results.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice != null) {
    results = results.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.originCountry.toLowerCase().includes(q),
    );
  }

  if (filters.sort === "price-asc") results.sort((a, b) => a.price - b.price);
  else if (filters.sort === "price-desc") results.sort((a, b) => b.price - a.price);
  else if (filters.sort === "name") results.sort((a, b) => a.title.localeCompare(b.title));

  return results;
}
