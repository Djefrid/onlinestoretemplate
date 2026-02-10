"use client";

import { useState, useEffect } from "react";

/**
 * Returns `true` once the user has scrolled past `threshold` pixels.
 * Used by Header to switch from transparent to white background.
 */
export function useScrollHeader(threshold = 20): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > threshold);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return scrolled;
}
