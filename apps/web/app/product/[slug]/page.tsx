import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { mockProducts } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { AddToCartButton } from "./AddToCartButton";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product, Tag } from "@/types";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

const tagVariant: Record<Tag, "bio" | "spicy" | "frozen"> = {
  Bio: "bio",
  Pimenté: "spicy",
  Surgelé: "frozen",
};

async function getProduct(slug: string): Promise<Product | null> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    const product = mockProducts.find((p) => p.slug === slug);
    if (!product) return null;
    // Simulate related products
    const related = mockProducts
      .filter((p) => p._id !== product._id)
      .slice(0, 4);
    return { ...product, relatedProducts: related };
  }

  try {
    return await getProductBySlug(slug);
  } catch {
    console.warn("[product] Sanity fetch failed, using mock data");
    const product = mockProducts.find((p) => p.slug === slug);
    if (!product) return null;
    const related = mockProducts
      .filter((p) => p._id !== product._id)
      .slice(0, 4);
    return { ...product, relatedProducts: related };
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Produit introuvable" };

  return {
    title: product.title,
    description: `${product.title} — ${formatPrice(product.price, product.currency)} · Origine: ${product.originCountry}`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const spicyEmojis = "🌶️".repeat(product.spicyLevel);

  return (
    <div className="container-page section-padding">
      {/* Product detail — 50/50 layout */}
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left: Image */}
        <div className="aspect-square overflow-hidden rounded-2xl bg-foreground/5">
          {product.images && product.images.length > 0 ? (
            <Image
              src={urlFor(product.images[0]).width(800).height(800).url()}
              alt={product.title}
              width={800}
              height={800}
              className="h-full w-full object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/5 to-accent/10 text-8xl">
              {product.tags.includes("Pimenté")
                ? "🌶️"
                : product.tags.includes("Surgelé")
                  ? "🧊"
                  : product.tags.includes("Bio")
                    ? "🌿"
                    : "🛒"}
            </div>
          )}
        </div>

        {/* Right: Content */}
        <div className="flex flex-col justify-center">
          {/* Category breadcrumb */}
          {product.category && (
            <p className="mb-2 text-sm text-foreground/40">
              {product.category.title}
            </p>
          )}

          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            {product.title}
          </h1>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant={tagVariant[tag]}>
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Price */}
          <p className="mt-6 text-3xl font-bold text-accent">
            {formatPrice(product.price, product.currency)}
          </p>

          {/* Meta info */}
          <div className="mt-6 space-y-2 text-sm text-foreground/60">
            <p>
              <span className="font-medium text-foreground">Origine :</span>{" "}
              {product.originCountry}
            </p>
            {product.spicyLevel > 0 && (
              <p>
                <span className="font-medium text-foreground">Piquant :</span>{" "}
                {spicyEmojis} ({product.spicyLevel}/3)
              </p>
            )}
            <p>
              <span className="font-medium text-foreground">Stock :</span>{" "}
              {product.stock > 0 ? (
                <span className="text-green-600">
                  En stock ({product.stock})
                </span>
              ) : (
                <span className="text-red-500">Rupture de stock</span>
              )}
            </p>
          </div>

          {/* Description placeholder */}
          {product.description ? (
            <div className="mt-6 text-sm leading-relaxed text-foreground/70">
              {typeof product.description === "string" ? (
                <p>{product.description}</p>
              ) : (
                <p className="italic text-foreground/40">
                  Description riche (Portable Text) — rendu disponible avec Sanity.
                </p>
              )}
            </div>
          ) : (
            <p className="mt-6 text-sm italic text-foreground/40">
              Un produit authentique importé directement d&apos;Afrique.
              Qualité premium garantie.
            </p>
          )}

          {/* Add to cart */}
          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>

      {/* Related products */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 font-display text-2xl font-bold">
            Souvent acheté avec&hellip;
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {product.relatedProducts.map((related) => (
              <ProductCard key={related._id} product={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
