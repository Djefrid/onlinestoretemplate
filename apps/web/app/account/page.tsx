import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { AccountActions } from "./AccountActions";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mon compte",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch orders with items
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const statusLabels: Record<string, string> = {
    pending: "En attente",
    paid: "Payée",
    shipped: "Expédiée",
    delivered: "Livrée",
    cancelled: "Annulée",
    refunded: "Remboursée",
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
    shipped: "bg-blue-100 text-blue-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    refunded: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="container-page section-padding">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Mon compte</h1>
          <p className="mt-1 text-sm text-foreground/60">{user.email}</p>
        </div>
        <AccountActions />
      </div>

      {/* Profil */}
      <section className="mt-10">
        <h2 className="mb-4 font-display text-xl font-bold">Profil</h2>
        <div className="rounded-2xl border border-foreground/5 bg-white p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-foreground/40">Nom</p>
              <p className="mt-1 font-medium">
                {profile?.full_name || "Non renseigné"}
              </p>
            </div>
            <div>
              <p className="text-xs text-foreground/40">Téléphone</p>
              <p className="mt-1 font-medium">
                {profile?.phone || "Non renseigné"}
              </p>
            </div>
            <div>
              <p className="text-xs text-foreground/40">Email</p>
              <p className="mt-1 font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-xs text-foreground/40">Points fidélité</p>
              <p className="mt-1 font-medium">{profile?.loyalty_points ?? 0}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Commandes */}
      <section className="mt-10">
        <h2 className="mb-4 font-display text-xl font-bold">
          Historique des commandes
        </h2>

        {!orders || orders.length === 0 ? (
          <div className="rounded-2xl border border-foreground/5 bg-white p-8 text-center">
            <span className="mb-3 block text-4xl">📦</span>
            <p className="text-foreground/50">Aucune commande pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-foreground/5 bg-white p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">
                      Commande du{" "}
                      {new Date(order.created_at).toLocaleDateString("fr-CA", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p className="mt-0.5 text-xs text-foreground/40">
                      {order.delivery_mode === "delivery"
                        ? "Livraison"
                        : "Ramassage"}
                      {order.pickup_slot && ` — ${order.pickup_slot}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[order.status] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      {statusLabels[order.status] ?? order.status}
                    </span>
                    <span className="text-sm font-bold text-accent">
                      {formatPrice(order.total_cents / 100)}
                    </span>
                  </div>
                </div>

                {/* Items */}
                {order.order_items && order.order_items.length > 0 && (
                  <div className="mt-3 border-t border-foreground/5 pt-3">
                    <div className="flex flex-wrap gap-2">
                      {order.order_items.map(
                        (item: { id: string; name: string; quantity: number }) => (
                          <span
                            key={item.id}
                            className="rounded-lg bg-foreground/5 px-2 py-1 text-xs text-foreground/60"
                          >
                            {item.name} ×{item.quantity}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
