"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";

interface ProductFiltersProps {
  categories: Category[];
}

const TAG_OPTIONS = ["Bio", "Pimenté", "Surgelé"] as const;
const SORT_OPTIONS = [
  { value: "", label: "Nouveauté" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "name", label: "Nom A-Z" },
] as const;

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentCategory = searchParams.get("category") ?? "";
  const currentTags = searchParams.getAll("tag");
  const currentSort = searchParams.get("sort") ?? "";
  const currentSearch = searchParams.get("q") ?? "";
  const currentMinPrice = searchParams.get("minPrice") ?? "";
  const currentMaxPrice = searchParams.get("maxPrice") ?? "";

  const [search, setSearch] = useState(currentSearch);

  const updateParams = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        params.delete(key);
        if (value === null || value === "") return;
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else {
          params.set(key, value);
        }
      });

      startTransition(() => {
        router.push(`/shop?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams],
  );

  const toggleTag = (tag: string) => {
    const next = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];
    updateParams({ tag: next.length > 0 ? next : null });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: search || null });
  };

  const clearAll = () => {
    setSearch("");
    router.push("/shop", { scroll: false });
  };

  const hasFilters =
    currentCategory || currentTags.length > 0 || currentSort || currentSearch || currentMinPrice || currentMaxPrice;

  return (
    <aside
      className={cn("space-y-8", isPending && "opacity-60 transition-opacity")}
    >
      {/* Search */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground/40">
          Recherche
        </h3>
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full rounded-lg border border-foreground/10 bg-white px-3 py-2 text-sm placeholder:text-foreground/30 focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-accent px-3 py-2 text-sm text-white hover:bg-accent-dark"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
        </form>
      </div>

      {/* Categories */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground/40">
          Catégorie
        </h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => updateParams({ category: null })}
              className={cn(
                "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                !currentCategory
                  ? "bg-accent/10 font-medium text-accent-dark"
                  : "text-foreground/60 hover:bg-foreground/5",
              )}
            >
              Toutes
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat._id}>
              <button
                onClick={() => updateParams({ category: cat.slug })}
                className={cn(
                  "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  currentCategory === cat.slug
                    ? "bg-accent/10 font-medium text-accent-dark"
                    : "text-foreground/60 hover:bg-foreground/5",
                )}
              >
                {cat.title}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Tags */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground/40">
          Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {TAG_OPTIONS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                currentTags.includes(tag)
                  ? "bg-accent text-white"
                  : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10",
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground/40">
          Prix (CAD)
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            step={0.01}
            placeholder="Min"
            defaultValue={currentMinPrice}
            onBlur={(e) => updateParams({ minPrice: e.target.value || null })}
            className="w-full rounded-lg border border-foreground/10 bg-white px-3 py-2 text-sm placeholder:text-foreground/30 focus:border-accent focus:outline-none"
          />
          <span className="text-foreground/30">–</span>
          <input
            type="number"
            min={0}
            step={0.01}
            placeholder="Max"
            defaultValue={currentMaxPrice}
            onBlur={(e) => updateParams({ maxPrice: e.target.value || null })}
            className="w-full rounded-lg border border-foreground/10 bg-white px-3 py-2 text-sm placeholder:text-foreground/30 focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground/40">
          Trier par
        </h3>
        <select
          value={currentSort}
          onChange={(e) => updateParams({ sort: e.target.value || null })}
          className="w-full rounded-lg border border-foreground/10 bg-white px-3 py-2 text-sm text-foreground/70 focus:border-accent focus:outline-none"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear all */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="text-sm text-accent underline underline-offset-2 hover:text-accent-dark"
        >
          Réinitialiser les filtres
        </button>
      )}
    </aside>
  );
}
