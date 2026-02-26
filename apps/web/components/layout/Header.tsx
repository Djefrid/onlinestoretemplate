"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  ChevronRight,
  ChevronDown,
  Store,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCartCount } from "@/lib/cart/useCartCount";
import type { Category } from "@/types";

interface HeaderProps {
  shopName?: string;
  logoUrl?: string;
  categories?: Category[];
}

const staticNav = [
  { label: "Rendez-vous", href: "/appointments" },
  { label: "À propos", href: "/about" },
];

const mobileMenuVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] as [number, number, number, number] },
  },
};

const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: -6, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.18, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    y: -4,
    scale: 0.97,
    transition: { duration: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.045, duration: 0.2, ease: "easeOut" as const },
  }),
};

export function Header({
  shopName = "Épicerie Africaine",
  logoUrl,
  categories = [],
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartCount = useCartCount();
  const catRef = useRef<HTMLDivElement>(null);
  const catTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ESC closes both menus
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setCatOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const openCat = () => {
    if (catTimer.current) clearTimeout(catTimer.current);
    setCatOpen(true);
  };
  const closeCat = () => {
    catTimer.current = setTimeout(() => setCatOpen(false), 120);
  };

  return (
    <header className="fixed top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={[
            "mt-3 rounded-2xl border transition-all duration-300",
            scrolled
              ? "border-slate-200/70 bg-white/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(15,23,42,0.12)]"
              : "border-slate-200/50 bg-white/60 backdrop-blur-lg shadow-[0_4px_20px_rgba(15,23,42,0.07)]",
          ].join(" ")}
        >
          {/* ── Main bar ── */}
          <div className="flex items-center justify-between px-4 py-2.5 sm:px-5">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group"
              aria-label={shopName}
            >
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={shopName}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-lg object-contain"
                />
              ) : (
                <Store
                  className="h-6 w-6 text-[#6858D8]"
                  aria-hidden="true"
                />
              )}
              <span className="text-[15px] font-semibold tracking-tight text-[#1E293B] group-hover:text-[#6858D8] transition-colors">
                {shopName}
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Navigation principale">

              {/* Boutique + dropdown catégories */}
              {categories.length > 0 ? (
                <div
                  ref={catRef}
                  className="relative"
                  onMouseEnter={openCat}
                  onMouseLeave={closeCat}
                >
                  <Link
                    href="/shop"
                    className="flex items-center gap-1 rounded-xl px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-[#6858D8]/8 hover:text-[#6858D8] transition-colors"
                    aria-haspopup="true"
                    aria-expanded={catOpen}
                  >
                    Boutique
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`}
                    />
                  </Link>

                  <AnimatePresence>
                    {catOpen && (
                      <motion.div
                        key="cat-dropdown"
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onMouseEnter={openCat}
                        onMouseLeave={closeCat}
                        className="absolute left-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-slate-200/60 bg-white/95 backdrop-blur-md shadow-lg"
                        role="menu"
                      >
                        <div className="py-1.5">
                          <Link
                            href="/shop"
                            onClick={() => setCatOpen(false)}
                            className="flex items-center px-4 py-2 text-sm font-semibold text-[#1E293B] hover:bg-[#6858D8]/8 hover:text-[#6858D8] transition-colors"
                            role="menuitem"
                          >
                            Tout voir
                          </Link>
                          <div className="my-1 border-t border-slate-100" />
                          {categories.map((cat) => (
                            <Link
                              key={cat._id}
                              href={`/shop?category=${cat.slug}`}
                              onClick={() => setCatOpen(false)}
                              className="flex items-center px-4 py-2 text-sm text-slate-600 hover:bg-[#6858D8]/8 hover:text-[#6858D8] transition-colors"
                              role="menuitem"
                            >
                              {cat.title}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/shop"
                  className="rounded-xl px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-[#6858D8]/8 hover:text-[#6858D8] transition-colors"
                >
                  Boutique
                </Link>
              )}

              {staticNav.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  className="rounded-xl px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-[#6858D8]/8 hover:text-[#6858D8] transition-colors"
                >
                  {it.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">

              {/* Account */}
              <Link
                href="/account"
                className="hidden sm:inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 p-2 text-slate-600 hover:border-[#6858D8]/30 hover:text-[#6858D8] transition-colors"
                aria-label="Mon compte"
              >
                <User className="h-4 w-4" />
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 p-2 text-slate-600 hover:border-[#6858D8]/30 hover:text-[#6858D8] transition-colors"
                aria-label={`Panier${cartCount > 0 ? ` (${cartCount} article${cartCount > 1 ? "s" : ""})` : ""}`}
              >
                <ShoppingCart className="h-4 w-4" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#6858D8] text-[10px] font-bold text-white"
                    >
                      {cartCount > 9 ? "9+" : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* CTA */}
              <Link
                href="/shop"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-[#6858D8] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#5B4CC2] active:scale-95 transition-all"
              >
                Commander
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>

              {/* Hamburger */}
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="md:hidden inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 p-2 text-slate-700 hover:bg-slate-50 transition-colors"
                aria-expanded={open ? "true" : "false"}
                aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {open ? (
                    <motion.span
                      key="x"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* ── Mobile panel ── */}
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                key="mobile-menu"
                variants={mobileMenuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="overflow-hidden md:hidden"
              >
                <div className="border-t border-slate-200/60 px-4 py-3 sm:px-5">
                  <div className="flex flex-col gap-1">

                    {/* Catégories Sanity */}
                    {categories.length > 0 && (
                      <>
                        <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                          Boutique
                        </p>
                        {categories.map((cat, i) => (
                          <motion.div
                            key={cat._id}
                            custom={i}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <Link
                              href={`/shop?category=${cat.slug}`}
                              onClick={() => setOpen(false)}
                              className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-[#6858D8]/8 hover:text-[#6858D8] transition-colors"
                            >
                              {cat.title}
                              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                            </Link>
                          </motion.div>
                        ))}
                        <div className="my-1.5 border-t border-slate-100" />
                      </>
                    )}

                    {/* Pages fixes */}
                    {[{ label: "Boutique complète", href: "/shop" }, ...staticNav].map(
                      (it, i) => (
                        <motion.div
                          key={it.href}
                          custom={(categories.length || 0) + i}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <Link
                            href={it.href}
                            onClick={() => setOpen(false)}
                            className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-[#6858D8]/8 hover:text-[#6858D8] transition-colors"
                          >
                            {it.label}
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                          </Link>
                        </motion.div>
                      ),
                    )}

                    <div className="my-2 border-t border-slate-100" />

                    <div className="flex flex-col gap-2">
                      <Link
                        href="/account"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 hover:border-[#6858D8]/30 hover:text-[#6858D8] transition-colors"
                      >
                        <User className="h-4 w-4" />
                        Mon compte
                      </Link>
                      <Link
                        href="/shop"
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-[#6858D8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5B4CC2] transition-colors"
                      >
                        Commander
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </header>
  );
}
