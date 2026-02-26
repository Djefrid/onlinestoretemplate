import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { Truck, ShieldCheck, Leaf, Star } from "lucide-react";
import { getProductBySlug, getAllProductSlugs } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { mockProducts } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "./ProductGallery";
import { StoryBlocks } from "./StoryBlocks";
import { MobileStickyBar } from "./MobileStickyBar";
import { AddToCartButton } from "./AddToCartButton";
import { ReviewsSection } from "@/components/product/ReviewsSection";
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
    return { ...product, relatedProducts: mockProducts.filter((p) => p._id !== product._id).slice(0, 4) };
  }
  try {
    return await getProductBySlug(slug);
  } catch {
    const product = mockProducts.find((p) => p.slug === slug);
    if (!product) return null;
    return { ...product, relatedProducts: mockProducts.filter((p) => p._id !== product._id).slice(0, 4) };
  }
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllProductSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Produit introuvable" };

  const ogImage =
    product.images?.length > 0
      ? urlFor(product.images[0]).width(1200).height(630).fit("crop").url()
      : undefined;

  return {
    title: product.title,
    description: `${product.title} — ${formatPrice(product.price, product.currency)} · Origine : ${product.originCountry}`,
    openGraph: {
      title: product.title,
      description: `${product.title} — ${formatPrice(product.price, product.currency)}`,
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
    },
  };
}

/* ─────────────────────────────────────────── */

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  /* Build image URLs server-side (urlFor doesn't run in client components) */
  const galleryImages = (product.images ?? []).map((img) => ({
    url: urlFor(img).width(900).height(900).fit("crop").url(),
    alt: img.alt ?? product.title,
  }));

  /* Spicy dots (up to 3) */
  const spicyDots = product.spicyLevel > 0
    ? Array.from({ length: 3 }, (_, i) => i < product.spicyLevel)
    : null;

  return (
    <>
      {/* Main content — extra bottom padding on mobile for sticky bar */}
      <div className="container-page section-padding pb-32 md:pb-16">

        {/* ── Top section: gallery + info ─── */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">

          {/* Left — Gallery */}
          <ProductGallery images={galleryImages} productName={product.title} />

          {/* Right — Product info */}
          <div className="flex flex-col justify-center">

            {/* Breadcrumb */}
            {product.category && (
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground/40">
                {product.category.title}
              </p>
            )}

            {/* Title */}
            <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
              {product.title}
            </h1>

            {/* Tags + rating row */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant={tagVariant[tag]}>
                  {tag}
                </Badge>
              ))}
              {product.isFeatured && (
                <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
                  <Star className="h-3 w-3 fill-current" />
                  Best-seller
                </span>
              )}
            </div>

            {/* Price */}
            <p className="mt-6 text-4xl font-bold tracking-tight text-primary">
              {formatPrice(product.price, product.currency)}
            </p>

            {/* Stock pill */}
            <div className="mt-3">
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  En stock — {product.stock} disponible{product.stock > 1 ? "s" : ""}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  Rupture de stock
                </span>
              )}
            </div>

            {/* Metadata row */}
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-foreground/55">
              <span>
                <span className="font-medium text-foreground">Origine :</span>{" "}
                {product.originCountry}
              </span>
              {spicyDots && (
                <span className="flex items-center gap-1.5">
                  <span className="font-medium text-foreground">Piquant :</span>
                  <span className="flex gap-0.5">
                    {spicyDots.map((active, i) => (
                      <span
                        key={i}
                        className={[
                          "h-2.5 w-2.5 rounded-full",
                          active ? "bg-red-500" : "bg-foreground/15",
                        ].join(" ")}
                      />
                    ))}
                  </span>
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mt-5 border-t border-foreground/[0.06] pt-5 text-sm leading-relaxed text-foreground/65">
                {Array.isArray(product.description) ? (
                  <PortableText
                    value={product.description}
                    components={{
                      block: {
                        normal: ({ children }) => (
                          <p className="mb-3 last:mb-0">{children}</p>
                        ),
                      },
                      marks: {
                        strong: ({ children }) => (
                          <strong className="font-semibold text-foreground">{children}</strong>
                        ),
                        em: ({ children }) => <em className="italic">{children}</em>,
                      },
                    }}
                  />
                ) : (
                  <p>{String(product.description)}</p>
                )}
              </div>
            )}

            {/* Add to cart */}
            <div className="mt-8">
              <AddToCartButton product={product} />
            </div>

            {/* Trust icons */}
            <div className="mt-8 flex flex-wrap gap-5 border-t border-foreground/[0.06] pt-6 text-xs text-foreground/50">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary/70" />
                Livraison rapide
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary/70" />
                Paiement sécurisé
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-primary/70" />
                Produits authentiques
              </div>
            </div>
          </div>
        </div>

        {/* ── StoryBlocks ─────────────────── */}
        <StoryBlocks
          originCountry={product.originCountry}
          preparationTips={product.preparationTips}
          producerNote={product.producerNote}
        />

        {/* ── Avis clients ────────────────── */}
        <ReviewsSection productSlug={product.slug} />

        {/* ── Related products ────────────── */}
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

      {/* ── Mobile sticky bar ───────────── */}
      <MobileStickyBar product={product} />
    </>
  );
}
