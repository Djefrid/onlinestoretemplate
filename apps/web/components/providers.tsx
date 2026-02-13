"use client";

import { type ReactNode, useEffect } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useCartStore } from "@/lib/cart/store";
import {
  pullCartFromSupabase,
  pushCartToSupabase,
  mergeCarts,
} from "@/lib/cart/sync";

/**
 * Client-side providers wrapper.
 * Handles cart sync when user logs in/out.
 */
export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        // Merge local cart with remote, then push merged result
        try {
          const localItems = useCartStore.getState().items;
          const remoteItems = await pullCartFromSupabase(
            supabase,
            session.user.id,
          );
          const merged = mergeCarts(localItems, remoteItems);

          // Update local store
          useCartStore.setState({ items: merged });

          // Push merged cart to Supabase
          await pushCartToSupabase(supabase, session.user.id, merged);
        } catch (err) {
          console.warn("[cart-sync] merge failed:", err);
        }
      }

      if (event === "SIGNED_OUT") {
        // Keep local cart as-is (guest mode)
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return <>{children}</>;
}
