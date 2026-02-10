"use client";

import { type ReactNode } from "react";

/**
 * Client-side providers wrapper.
 * Zustand doesn't need a provider — it works via hooks.
 * This component is ready to wrap future providers (Toaster, etc.).
 */
export function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
