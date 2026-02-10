/**
 * Seed script: Creates 3 categories + 8 products in Sanity.
 *
 * Usage:
 *   1. Set environment variables (or create .env in this folder):
 *      SANITY_PROJECT_ID=your-project-id
 *      SANITY_DATASET=production
 *      SANITY_API_TOKEN=your-write-token
 *
 *   2. Run:
 *      node seed/seed-sanity.mjs
 */

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

/* ── Categories ─────────────────────── */

const categories = [
  {
    _id: "category-epices",
    _type: "category",
    title: "Épices",
    slug: { _type: "slug", current: "epices" },
    description: "Piments, mélanges et saveurs intenses du continent",
    order: 1,
  },
  {
    _id: "category-frais",
    _type: "category",
    title: "Produits Frais",
    slug: { _type: "slug", current: "frais" },
    description: "Feuilles, tubercules et produits importés chaque semaine",
    order: 2,
  },
  {
    _id: "category-soins",
    _type: "category",
    title: "Soins & Beauté",
    slug: { _type: "slug", current: "soins" },
    description: "Beurre de karité, savon noir et cosmétiques naturels",
    order: 3,
  },
];

/* ── Products ───────────────────────── */

const products = [
  {
    _type: "product",
    title: "Piment de Cayenne moulu",
    slug: { _type: "slug", current: "piment-cayenne-moulu" },
    price: 6.99,
    currency: "CAD",
    category: { _type: "reference", _ref: "category-epices" },
    tags: ["Pimenté"],
    originCountry: "Cameroun 🇨🇲",
    spicyLevel: 3,
    isFrozen: false,
    isOrganic: false,
    stock: 25,
    isFeatured: true,
  },
  {
    _type: "product",
    title: "Beurre de Karité pur",
    slug: { _type: "slug", current: "beurre-karite-pur" },
    price: 14.99,
    currency: "CAD",
    category: { _type: "reference", _ref: "category-soins" },
    tags: ["Bio"],
    originCountry: "Côte d'Ivoire 🇨🇮",
    spicyLevel: 0,
    isFrozen: false,
    isOrganic: true,
    stock: 18,
    isFeatured: true,
  },
  {
    _type: "product",
    title: "Gari blanc premium",
    slug: { _type: "slug", current: "gari-blanc-premium" },
    price: 8.49,
    currency: "CAD",
    category: { _type: "reference", _ref: "category-frais" },
    tags: [],
    originCountry: "Nigeria 🇳🇬",
    spicyLevel: 0,
    isFrozen: false,
    isOrganic: false,
    stock: 30,
    isFeatured: true,
  },
  {
    _type: "product",
    title: "Feuilles de Manioc surgelées",
    slug: { _type: "slug", current: "feuilles-manioc-surgelees" },
    price: 7.99,
    currency: "CAD",
    category: { _type: "reference", _ref: "category-frais" },
    tags: ["Surgelé"],
    originCountry: "Congo 🇨🇬",
    spicyLevel: 0,
    isFrozen: true,
    isOrganic: false,
    stock: 12,
    isFeatured: true,
  },
  {
    _type: "product",
    title: "Huile de Palme Rouge",
    slug: { _type: "slug", current: "huile-palme-rouge" },
    price: 11.99,
    currency: "CAD",
    category: { _type: "reference", _ref: "category-epices" },
    tags: ["Bio"],
    originCountry: "Cameroun 🇨🇲",
    spicyLevel: 0,
    isFrozen: false,
    isOrganic: true,
    stock: 20,
    isFeatured: true,
  },
  {
    _type: "product",
    title: "Bissap séché (Hibiscus)",
    slug: { _type: "slug", current: "bissap-seche-hibiscus" },
    price: 5.49,
    currency: "CAD",
    category: { _type: "reference", _ref: "category-epices" },
    tags: ["Bio"],
    originCountry: "Sénégal 🇸🇳",
    spicyLevel: 0,
    isFrozen: false,
    isOrganic: true,
    stock: 35,
    isFeatured: true,
  },
  {
    _type: "product",
    title: "Plantain Chips épicées",
    slug: { _type: "slug", current: "plantain-chips-epicees" },
    price: 4.99,
    currency: "CAD",
    category: { _type: "reference", _ref: "category-frais" },
    tags: ["Pimenté"],
    originCountry: "Ghana 🇬🇭",
    spicyLevel: 2,
    isFrozen: false,
    isOrganic: false,
    stock: 40,
    isFeatured: true,
  },
  {
    _type: "product",
    title: "Savon Noir Africain",
    slug: { _type: "slug", current: "savon-noir-africain" },
    price: 9.99,
    currency: "CAD",
    category: { _type: "reference", _ref: "category-soins" },
    tags: ["Bio"],
    originCountry: "Ghana 🇬🇭",
    spicyLevel: 0,
    isFrozen: false,
    isOrganic: true,
    stock: 22,
    isFeatured: true,
  },
];

/* ── Seed ────────────────────────────── */

async function seed() {
  console.log("Seeding Sanity dataset...\n");

  // Create categories
  for (const cat of categories) {
    const result = await client.createOrReplace(cat);
    console.log(`  ✓ Category: ${result.title}`);
  }

  // Create products
  for (const prod of products) {
    const result = await client.create(prod);
    console.log(`  ✓ Product: ${result.title} (${result._id})`);
  }

  console.log("\n✅ Seed complete: 3 categories + 8 products created.");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
