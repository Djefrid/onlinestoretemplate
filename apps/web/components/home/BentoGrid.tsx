import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { mockCategories } from "@/lib/mock-data";
import type { Category } from "@/types";

/* Dégradés de fallback quand pas d'image */
const gradients = [
  "from-orange-50 to-amber-50",
  "from-green-50 to-emerald-50",
  "from-amber-50 to-yellow-50",
  "from-rose-50 to-pink-50",
];

const fallbackEmojis = ["🌶️", "🥬", "✨", "🛒"];

async function fetchCategories(): Promise<Category[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return mockCategories;
  }
  try {
    const categories = await getCategories();
    return categories.length > 0 ? categories : mockCategories;
  } catch {
    return mockCategories;
  }
}

export async function BentoGrid() {
  const categories = await fetchCategories();

  return (
    <section className="section-padding">
      <div className="container-page">
        {/* Section header */}
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Nos catégories
          </h2>
          <p className="mt-3 text-foreground/60">
            Des produits sélectionnés avec soin, directement d&apos;Afrique
          </p>
        </div>

        {/* Bento — première catégorie = grande carte 2×2 */}
        <div className="grid gap-4 sm:grid-cols-3 sm:grid-rows-2">
          {categories.slice(0, 3).map((cat, i) => {
            const span =
              i === 0
                ? "sm:col-span-2 sm:row-span-2"
                : "sm:col-span-1 sm:row-span-1";
            const gradient = gradients[i % gradients.length];
            const hasImage = !!(cat.image && cat.image.asset);

            return (
              <Link
                key={cat._id}
                href={`/shop?category=${cat.slug}`}
                className={`group relative flex flex-col justify-end overflow-hidden rounded-2xl p-6 transition-shadow duration-300 hover:shadow-lg sm:p-8 ${span} ${hasImage ? "min-h-[200px] sm:min-h-0" : `bg-gradient-to-br ${gradient}`}`}
              >
                {/* Image de fond Sanity */}
                {hasImage ? (
                  <>
                    <Image
                      src={urlFor(cat.image!)
                        .width(i === 0 ? 800 : 500)
                        .height(i === 0 ? 800 : 500)
                        .url()}
                      alt={cat.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes={
                        i === 0
                          ? "(max-width: 640px) 100vw, 66vw"
                          : "(max-width: 640px) 100vw, 33vw"
                      }
                    />
                    {/* Overlay pour lisibilité du texte */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  </>
                ) : (
                  /* Emoji decoration si pas d'image */
                  <span className="absolute -right-4 -top-4 text-7xl opacity-20 transition-transform duration-500 group-hover:scale-110 sm:text-8xl">
                    {fallbackEmojis[i % fallbackEmojis.length]}
                  </span>
                )}

                <div className="relative z-10">
                  {!hasImage && (
                    <span className="mb-3 block text-4xl">
                      {fallbackEmojis[i % fallbackEmojis.length]}
                    </span>
                  )}
                  <h3
                    className={`font-display text-xl font-bold sm:text-2xl ${hasImage ? "text-white" : ""}`}
                  >
                    {cat.title}
                  </h3>
                  {cat.description && (
                    <p
                      className={`mt-2 text-sm leading-relaxed ${hasImage ? "text-white/80" : "text-foreground/60"}`}
                    >
                      {cat.description}
                    </p>
                  )}
                  <span
                    className={`mt-4 inline-flex items-center gap-1 text-sm font-medium ${hasImage ? "text-white" : "text-accent-dark"}`}
                  >
                    Découvrir
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
