"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Flame, Leaf, ArrowRight, Store, BadgeCheck } from "lucide-react";

interface HeroProps {
  heroTitle?: string;
  heroSubtitle?: string;
  bannerUrl?: string;
  bannerAlt?: string;
}

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number], delay: 0.15 } },
};

const stagger: Variants = {
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
};

export function Hero({ heroTitle, heroSubtitle, bannerUrl, bannerAlt }: HeroProps) {
  const title = heroTitle || "L'excellence du terroir africain, chez vous.";
  const subtitle =
    heroSubtitle ||
    "Épices rares, produits frais et soins naturels importés directement du continent africain.";

  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-background">
      {/* Ambient background blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="container-page flex min-h-[90vh] items-center">
        <div className="grid w-full grid-cols-1 items-center gap-12 py-24 lg:grid-cols-12 lg:gap-8 lg:py-0">

          {/* ── Left column ─────────────────────── */}
          <motion.div
            className="lg:col-span-6 xl:col-span-5"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            {/* Eyebrow badge */}
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-sm font-medium text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Saveurs authentiques d&apos;Afrique
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={fadeUp}
              className="mt-6 font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl xl:text-6xl"
            >
              {title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-lg text-lg leading-relaxed text-foreground/60"
            >
              {subtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4">
              <motion.div whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.02 }}>
                <Link
                  href="/shop"
                  className="inline-flex h-12 items-center gap-2 rounded-2xl bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-shadow hover:shadow-primary/40"
                >
                  Commander maintenant
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </motion.div>
              <motion.div whileTap={{ scale: 0.96 }}>
                <Link
                  href="/appointments"
                  className="inline-flex h-12 items-center gap-2 rounded-2xl border border-border bg-card px-7 text-sm font-semibold text-foreground transition-colors hover:border-primary/30 hover:bg-primary/5"
                >
                  Réserver un créneau
                </Link>
              </motion.div>
            </motion.div>

            {/* Social proof */}
            <motion.div variants={fadeUp} className="mt-12 flex items-center gap-4">
              <div className="flex -space-x-2">
                {["🧑🏾", "👩🏿", "🧑🏽", "👨🏾"].map((emoji, i) => (
                  <span
                    key={i}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-secondary text-sm"
                  >
                    {emoji}
                  </span>
                ))}
              </div>
              <p className="text-sm text-foreground/50">
                <span className="font-semibold text-foreground">+100</span> clients satisfaits
              </p>
            </motion.div>
          </motion.div>

          {/* ── Right column — image montage ─────── */}
          <motion.div
            className="relative hidden lg:col-span-6 lg:block xl:col-span-7"
            variants={fadeRight}
            initial="hidden"
            animate="show"
          >
            <div className="relative h-[540px]">

              {/* Main card */}
              <motion.div
                className="absolute left-0 top-8 h-[420px] w-[340px] overflow-hidden rounded-3xl shadow-2xl"
                style={{ rotate: -4 }}
                whileHover={{ rotate: -2, y: -6, transition: { type: "spring", stiffness: 300 } }}
              >
                {bannerUrl ? (
                  <Image
                    src={bannerUrl}
                    alt={bannerAlt || "Épicerie Africaine"}
                    fill
                    className="object-cover"
                    priority
                    sizes="340px"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-secondary">
                    <Store className="h-20 w-20 text-primary/50" aria-hidden="true" />
                    <span className="mt-4 text-4xl">🌶️ 🥜 ✨</span>
                  </div>
                )}
                {/* Overlay glint */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10" />
              </motion.div>

              {/* Secondary card — spices */}
              <motion.div
                className="absolute bottom-8 right-4 h-[200px] w-[180px] overflow-hidden rounded-2xl shadow-xl"
                style={{ rotate: 5 }}
                whileHover={{ rotate: 3, y: -4, transition: { type: "spring", stiffness: 300 } }}
              >
                <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-amber-50 to-orange-100/80 px-4">
                  {/* Cercle icon */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/15 ring-1 ring-amber-400/20">
                    <Flame className="h-6 w-6 text-amber-600" strokeWidth={1.5} />
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-amber-800/70">
                      Sélection
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-amber-900">
                      Épices rares
                    </p>
                  </div>
                  {/* Dot déco */}
                  <div className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-amber-400/40" />
                </div>
              </motion.div>

              {/* Tertiary card — beauty */}
              <motion.div
                className="absolute right-16 top-4 h-[140px] w-[140px] overflow-hidden rounded-2xl shadow-lg"
                style={{ rotate: 7 }}
                whileHover={{ rotate: 5, y: -4, transition: { type: "spring", stiffness: 300 } }}
              >
                <div className="relative flex h-full w-full flex-col items-center justify-center gap-2.5 bg-gradient-to-br from-violet-50 to-purple-100/80 px-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/15 ring-1 ring-violet-400/20">
                    <Leaf className="h-5 w-5 text-violet-600" strokeWidth={1.5} />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-violet-800/60">
                      Bio
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-violet-900">
                      Soins naturels
                    </p>
                  </div>
                  <div className="absolute left-3 top-3 h-1.5 w-1.5 rounded-full bg-violet-400/40" />
                </div>
              </motion.div>

              {/* Floating badge */}
              <motion.div
                className="absolute bottom-4 left-8 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-foreground">Origine certifiée</p>
                  <p className="text-[10px] text-foreground/50">Directement d&apos;Afrique</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
