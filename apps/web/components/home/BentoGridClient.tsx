"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { urlFor } from "@/lib/sanity/image";
import { Button } from "@/components/ui/Button";
import type { Category } from "@/types";

interface BentoGridClientProps {
  categories: Category[];
}

/* Palettes de dégradé par position */
const tileStyles = [
  { gradient: "from-violet-100 via-purple-50 to-indigo-50", icon: "🌶️", accent: "text-violet-600" },
  { gradient: "from-emerald-100 via-green-50 to-teal-50",   icon: "🥬", accent: "text-emerald-600" },
  { gradient: "from-amber-100 via-orange-50 to-yellow-50",  icon: "✨", accent: "text-amber-600"   },
  { gradient: "from-rose-100 via-pink-50 to-red-50",        icon: "🫒", accent: "text-rose-600"    },
];

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const tileVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export function BentoGridClient({ categories }: BentoGridClientProps) {
  return (
    <section className="section-padding bg-secondary/40">
      <div className="container-page">
        {/* Header */}
        <div className="mb-14 flex items-end justify-between">
          <div className="text-center sm:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.08] px-4 py-1.5 text-sm font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Collections
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Nos catégories
            </h2>
            <p className="mt-3 text-foreground/55">
              Des produits sélectionnés avec soin, directement d&apos;Afrique
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="hidden shrink-0 gap-1.5 self-end sm:flex">
            <Link href="/shop">
              Voir tout
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Bento grid avec animation scroll */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-4 sm:grid-cols-3 sm:grid-rows-2"
        >
          {categories.slice(0, 4).map((cat, i) => {
            const isLarge = i === 0;
            const style   = tileStyles[i % tileStyles.length];
            const hasImg  = !!(cat.image?.asset);

            return (
              <motion.div
                key={cat._id}
                variants={tileVariants}
                className={isLarge ? "sm:col-span-2 sm:row-span-2" : ""}
              >
                <Link
                  href={`/shop?category=${cat.slug}`}
                  className={[
                    "group relative flex h-full flex-col justify-end overflow-hidden rounded-2xl transition-all duration-300",
                    "hover:-translate-y-1 hover:shadow-[0_8px_40px_-8px_hsl(249,62%,60%,0.25)]",
                    "border border-transparent hover:border-primary/15",
                    isLarge ? "min-h-[260px] sm:min-h-0 p-8" : "min-h-[160px] p-6",
                    hasImg ? "" : `bg-gradient-to-br ${style.gradient}`,
                  ].join(" ")}
                >
                  {/* Image Sanity */}
                  {hasImg && (
                    <>
                      <Image
                        src={urlFor(cat.image!).width(isLarge ? 800 : 500).height(isLarge ? 800 : 500).url()}
                        alt={cat.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes={isLarge ? "(max-width:640px) 100vw, 66vw" : "(max-width:640px) 100vw, 33vw"}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    </>
                  )}

                  {/* Emoji déco (fallback) */}
                  {!hasImg && (
                    <span className={[
                      "absolute opacity-15 transition-all duration-500 group-hover:scale-110 group-hover:opacity-25",
                      isLarge ? "-right-4 -top-4 text-8xl sm:text-9xl" : "-right-2 -top-2 text-6xl",
                    ].join(" ")}>
                      {style.icon}
                    </span>
                  )}

                  {/* Content */}
                  <div className="relative z-10">
                    {!hasImg && (
                      <span className={`mb-3 block ${isLarge ? "text-4xl" : "text-3xl"}`}>
                        {style.icon}
                      </span>
                    )}

                    <h3 className={[
                      "font-display font-bold leading-tight",
                      isLarge ? "text-2xl sm:text-3xl" : "text-lg",
                      hasImg ? "text-white" : "text-foreground",
                    ].join(" ")}>
                      {cat.title}
                    </h3>

                    {cat.description && isLarge && (
                      <p className={`mt-2 text-sm leading-relaxed ${hasImg ? "text-white/70" : "text-foreground/60"}`}>
                        {cat.description}
                      </p>
                    )}

                    <span className={[
                      "mt-4 inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 group-hover:gap-2.5",
                      hasImg ? "text-white" : style.accent,
                    ].join(" ")}>
                      Découvrir
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </div>

                  {/* Glow border au hover */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-1 ring-primary/30 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center sm:hidden">
          <Button asChild variant="outline" size="sm">
            <Link href="/shop">Voir toutes les catégories</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
