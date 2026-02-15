"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart/store";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { DeliveryMode } from "@/types";

const SHIPPING_COST = parseFloat(process.env.NEXT_PUBLIC_SHIPPING_COST || "5.99");
const FREE_SHIPPING_THRESHOLD = parseFloat(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || "75");

const PICKUP_SLOTS = [
  "Lundi 10h–12h",
  "Lundi 14h–17h",
  "Mercredi 10h–12h",
  "Mercredi 14h–17h",
  "Vendredi 10h–12h",
  "Vendredi 14h–17h",
  "Samedi 10h–14h",
];

interface FormErrors {
  [key: string]: string | undefined;
}

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const totalItems = useCartStore((s) => s.totalItems());

  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("delivery");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState("");

  // Form state
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    postalCode: "",
    province: "QC",
    pickupSlot: "",
  });

  // Pre-fill form from Supabase profile if user is logged in
  useEffect(() => {
    const prefill = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, phone")
          .eq("id", user.id)
          .single();

        setForm((prev) => ({
          ...prev,
          customerEmail: user.email || prev.customerEmail,
          customerName: profile?.full_name || prev.customerName,
          phone: profile?.phone || prev.phone,
        }));
      } catch {
        // Supabase not configured — keep empty form
      }
    };
    prefill();
  }, []);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const shippingFree = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = deliveryMode === "delivery" && !shippingFree ? SHIPPING_COST : 0;
  const total = subtotal + shipping;

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="container-page section-padding text-center">
        <span className="mb-6 block text-6xl" aria-hidden="true">🛒</span>
        <h1 className="font-display text-3xl font-bold">Panier vide</h1>
        <p className="mt-3 text-foreground/60">
          Ajoutez des produits avant de passer commande.
        </p>
        <div className="mt-8">
          <Button href="/shop" size="lg">Voir la boutique</Button>
        </div>
      </div>
    );
  }

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!form.customerName.trim()) errs.customerName = "Nom requis";
    if (!form.customerEmail.includes("@")) errs.customerEmail = "Email invalide";
    if (form.phone.length < 8) errs.phone = "Téléphone invalide";

    if (deliveryMode === "delivery") {
      if (!form.line1.trim()) errs.line1 = "Adresse requise";
      if (!form.city.trim()) errs.city = "Ville requise";
      if (!form.postalCode.trim()) errs.postalCode = "Code postal requis";
    }

    if (deliveryMode === "pickup" && !form.pickupSlot) {
      errs.pickupSlot = "Choisissez un créneau";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError("");

    try {
      const payload = {
        items,
        deliveryMode,
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        phone: form.phone,
        ...(deliveryMode === "delivery" && {
          address: {
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            postalCode: form.postalCode,
            province: form.province,
            country: "CA",
          },
        }),
        ...(deliveryMode === "pickup" && {
          pickupSlot: form.pickupSlot,
        }),
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.error || "Erreur lors de la création du paiement");
        return;
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setApiError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page section-padding">
      <h1 className="mb-10 font-display text-3xl font-bold sm:text-4xl">
        Commande
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-10 lg:flex-row">
        {/* Left: Form */}
        <div className="flex-1 space-y-8">
          {/* Delivery mode toggle */}
          <div>
            <h2 className="mb-4 font-display text-lg font-bold">
              Mode de récupération
            </h2>
            <div className="flex gap-3">
              {(["delivery", "pickup"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setDeliveryMode(mode)}
                  className={cn(
                    "flex-1 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-colors",
                    deliveryMode === mode
                      ? "border-accent bg-accent/5 text-accent-dark"
                      : "border-foreground/10 text-foreground/50 hover:border-foreground/20",
                  )}
                >
                  {mode === "delivery" ? "🚚 Livraison" : "🏪 Ramassage en magasin"}
                </button>
              ))}
            </div>
          </div>

          {/* Contact info */}
          <div>
            <h2 className="mb-4 font-display text-lg font-bold">
              Vos coordonnées
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label="Nom complet"
                value={form.customerName}
                onChange={(v) => updateField("customerName", v)}
                error={errors.customerName}
                autoComplete="name"
              />
              <InputField
                label="Email"
                type="email"
                value={form.customerEmail}
                onChange={(v) => updateField("customerEmail", v)}
                error={errors.customerEmail}
                autoComplete="email"
              />
              <InputField
                label="Téléphone"
                type="tel"
                value={form.phone}
                onChange={(v) => updateField("phone", v)}
                error={errors.phone}
                autoComplete="tel"
                className="sm:col-span-2"
              />
            </div>
          </div>

          {/* Delivery: address */}
          {deliveryMode === "delivery" && (
            <div>
              <h2 className="mb-4 font-display text-lg font-bold">
                Adresse de livraison
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  label="Adresse"
                  value={form.line1}
                  onChange={(v) => updateField("line1", v)}
                  error={errors.line1}
                  autoComplete="address-line1"
                  className="sm:col-span-2"
                />
                <InputField
                  label="Appartement, suite (optionnel)"
                  value={form.line2}
                  onChange={(v) => updateField("line2", v)}
                  autoComplete="address-line2"
                  className="sm:col-span-2"
                />
                <InputField
                  label="Ville"
                  value={form.city}
                  onChange={(v) => updateField("city", v)}
                  error={errors.city}
                  autoComplete="address-level2"
                />
                <InputField
                  label="Code postal"
                  value={form.postalCode}
                  onChange={(v) => updateField("postalCode", v)}
                  error={errors.postalCode}
                  autoComplete="postal-code"
                />
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground/70">
                    Province
                  </label>
                  <select
                    value={form.province}
                    onChange={(e) => updateField("province", e.target.value)}
                    className="w-full rounded-lg border border-foreground/10 bg-white px-3 py-2.5 text-sm focus:border-accent focus:outline-none"
                  >
                    <option value="QC">Québec</option>
                    <option value="ON">Ontario</option>
                    <option value="BC">Colombie-Britannique</option>
                    <option value="AB">Alberta</option>
                    <option value="MB">Manitoba</option>
                    <option value="SK">Saskatchewan</option>
                    <option value="NS">Nouvelle-Écosse</option>
                    <option value="NB">Nouveau-Brunswick</option>
                    <option value="PE">Île-du-Prince-Édouard</option>
                    <option value="NL">Terre-Neuve-et-Labrador</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Pickup: slot selector */}
          {deliveryMode === "pickup" && (
            <div>
              <h2 className="mb-4 font-display text-lg font-bold">
                Créneau de ramassage
              </h2>
              <p className="mb-3 text-sm text-foreground/60">
                📍 L&apos;adresse de retrait vous sera communiquée par email après confirmation de la commande.
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {PICKUP_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => {
                      updateField("pickupSlot", slot);
                      setErrors((prev) => ({ ...prev, pickupSlot: undefined }));
                    }}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-sm transition-colors",
                      form.pickupSlot === slot
                        ? "border-accent bg-accent/10 font-medium text-accent-dark"
                        : "border-foreground/10 text-foreground/60 hover:border-foreground/20",
                    )}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              {errors.pickupSlot && (
                <p className="mt-2 text-xs text-red-500">{errors.pickupSlot}</p>
              )}
            </div>
          )}
        </div>

        {/* Right: Order summary */}
        <div className="w-full shrink-0 lg:w-80">
          <div className="sticky top-24 rounded-2xl border border-foreground/5 bg-white p-6">
            <h2 className="font-display text-lg font-bold">Votre commande</h2>

            {/* Items */}
            <div className="mt-4 divide-y divide-foreground/5">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between py-2.5 text-sm"
                >
                  <span className="text-foreground/70">
                    {item.name}{" "}
                    <span className="text-foreground/40">×{item.quantity}</span>
                  </span>
                  <span className="font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-4 space-y-2 border-t border-foreground/5 pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground/60">Sous-total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">Livraison</span>
                <span>
                  {deliveryMode === "pickup"
                    ? "Gratuit (retrait)"
                    : shippingFree
                      ? "Gratuite"
                      : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between border-t border-foreground/5 pt-2 text-base font-bold">
                <span>Total</span>
                <span className="text-accent">{formatPrice(total)}</span>
              </div>
            </div>

            {/* API error */}
            {apiError && (
              <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                {apiError}
              </div>
            )}

            {/* Submit */}
            <div className="mt-6">
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Redirection…
                  </span>
                ) : (
                  "Payer avec Stripe"
                )}
              </Button>
            </div>

            <p className="mt-3 text-center text-xs text-foreground/40">
              Vous serez redirigé vers Stripe pour le paiement sécurisé.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

/* ── Reusable input field ─────────────── */

/*test*/
function InputField({
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-foreground/70">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className={cn(
          "w-full rounded-lg border bg-white px-3 py-2.5 text-sm transition-colors focus:outline-none",
          error
            ? "border-red-300 focus:border-red-500"
            : "border-foreground/10 focus:border-accent",
        )}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
