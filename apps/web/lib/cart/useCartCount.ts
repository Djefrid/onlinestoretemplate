"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/cart/store";
import { isSupabaseConfigured } from "@/lib/supabase/client";

/**
 * Retourne le nombre total d'articles dans le panier.
 * - Utilisateur connecté : lit depuis Supabase cart_items + écoute realtime.
 * - Invité ou Supabase non configuré : fallback sur le store Zustand (localStorage).
 */
export function useCartCount(): number {
  const zustandCount = useCartStore((s) => s.totalItems());
  const [dbCount, setDbCount] = useState<number | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let cancelled = false;
    let dispose: (() => void) | undefined;

    async function bootstrap() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user || cancelled) return;
        const userId = session.user.id;

        async function loadCount() {
          if (cancelled) return;
          const { data, error } = await supabase
            .from("cart_items")
            .select("quantity")
            .eq("user_id", userId);
          if (!error && data && !cancelled) {
            setDbCount(data.reduce((sum, row) => sum + (row.quantity ?? 0), 0));
          }
        }

        await loadCount();

        // Realtime — mise à jour automatique si cart_items change
        const channel = supabase
          .channel(`cart-count-${userId}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "cart_items",
              filter: `user_id=eq.${userId}`,
            },
            loadCount,
          )
          .subscribe();

        // Reset si déconnexion
        const {
          data: { subscription: authSub },
        } = supabase.auth.onAuthStateChange((_event, sess) => {
          if (!sess) setDbCount(null);
        });

        dispose = () => {
          supabase.removeChannel(channel);
          authSub.unsubscribe();
        };
      } catch {
        // Table cart_items inexistante ou Supabase non prêt → Zustand prend le relais
      }
    }

    bootstrap();

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  // Priorité : Supabase (connecté) › Zustand (invité)
  return dbCount ?? zustandCount;
}
