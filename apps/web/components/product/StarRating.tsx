"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number; // 0–5, décimales autorisées en mode affichage
  onChange?: (value: number) => void; // si défini → mode interactif
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function StarRating({ value, onChange, size = "md", className }: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const interactive = typeof onChange === "function";
  const display = hovered ?? value;

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      role={interactive ? "radiogroup" : undefined}
      aria-label={interactive ? "Note sur 5 étoiles" : `${value} étoile${value !== 1 ? "s" : ""} sur 5`}
    >
      {Array.from({ length: 5 }, (_, i) => {
        const starValue = i + 1;
        const filled = display >= starValue;
        const partial = !filled && display > i && !interactive;
        const fillPercent = partial ? Math.round((display - i) * 100) : filled ? 100 : 0;

        return (
          <button
            key={i}
            type="button"
            role={interactive ? "radio" : undefined}
            aria-checked={interactive ? value === starValue : undefined}
            aria-label={interactive ? `${starValue} étoile${starValue !== 1 ? "s" : ""}` : undefined}
            tabIndex={interactive ? 0 : -1}
            onClick={interactive ? () => onChange(starValue) : undefined}
            onMouseEnter={interactive ? () => setHovered(starValue) : undefined}
            onMouseLeave={interactive ? () => setHovered(null) : undefined}
            onKeyDown={
              interactive
                ? (e) => {
                    if (e.key === "ArrowRight" && starValue < 5) onChange(starValue + 1);
                    if (e.key === "ArrowLeft" && starValue > 1) onChange(starValue - 1);
                  }
                : undefined
            }
            className={cn(
              "relative shrink-0 outline-none",
              interactive
                ? "cursor-pointer transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-primary/50 rounded-sm"
                : "cursor-default",
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={cn(sizes[size], "text-foreground/15")}
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>

            {/* Étoile remplie (pleine ou partielle via clip) */}
            {fillPercent > 0 && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercent}%` }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className={cn(sizes[size], "text-amber-400")}
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
