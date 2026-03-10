"use client";

import { useState, useEffect } from "react";

const DEFAULT_SHIPPING_COST = parseFloat(process.env.NEXT_PUBLIC_SHIPPING_COST || "5.99");
const DEFAULT_FREE_THRESHOLD = parseFloat(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || "75");
const DEFAULT_PICKUP_SLOTS = [
  "Lundi 10h–12h",
  "Lundi 14h–17h",
  "Mercredi 10h–12h",
  "Mercredi 14h–17h",
  "Vendredi 10h–12h",
  "Vendredi 14h–17h",
  "Samedi 10h–14h",
];

export interface ShippingConfig {
  shippingCost: number;
  freeShippingThreshold: number;
  pickupSlots: string[];
}

// Cache module-level : fetch une seule fois pour toute la session
let _cache: ShippingConfig | null = null;

/**
 * Hook retournant la config shipping depuis Sanity (via /api/config).
 * - Valeur initiale = env vars (affichage immédiat, pas de flash).
 * - useEffect met à jour depuis Sanity en arrière-plan (max 60s de délai).
 */
export function useShippingConfig(): ShippingConfig {
  const [config, setConfig] = useState<ShippingConfig>({
    shippingCost: DEFAULT_SHIPPING_COST,
    freeShippingThreshold: DEFAULT_FREE_THRESHOLD,
    pickupSlots: DEFAULT_PICKUP_SLOTS,
  });

  useEffect(() => {
    if (_cache) {
      setConfig(_cache);
      return;
    }
    fetch("/api/config")
      .then((r) => r.json())
      .then((data: ShippingConfig) => {
        _cache = data;
        setConfig(data);
      })
      .catch(() => {
        // Silencieux — les valeurs par défaut (env vars) restent actives
      });
  }, []);

  return config;
}
