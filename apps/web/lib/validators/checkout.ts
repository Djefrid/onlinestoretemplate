import { z } from "zod";

const cartItemSchema = z.object({
  productId: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  price: z.number().positive(),
  currency: z.string().default("CAD"),
  image: z.string().optional(),
  quantity: z.number().int().positive(),
});

const addressSchema = z.object({
  line1: z.string().min(1, "Adresse requise"),
  line2: z.string().optional(),
  city: z.string().min(1, "Ville requise"),
  postalCode: z.string().min(1, "Code postal requis"),
  province: z.string().min(1, "Province requise"),
  country: z.string().default("CA"),
});

export const checkoutSchema = z
  .object({
    items: z.array(cartItemSchema).min(1, "Le panier est vide"),
    deliveryMode: z.enum(["delivery", "pickup"]),
    customerName: z.string().min(1, "Nom requis"),
    customerEmail: z.string().email("Email invalide"),
    phone: z.string().min(8, "Téléphone invalide"),
    address: addressSchema.optional(),
    pickupSlot: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.deliveryMode === "delivery") return !!data.address;
      return true;
    },
    { message: "Adresse requise pour la livraison", path: ["address"] },
  )
  .refine(
    (data) => {
      if (data.deliveryMode === "pickup") return !!data.pickupSlot;
      return true;
    },
    { message: "Créneau requis pour le ramassage", path: ["pickupSlot"] },
  );

export type CheckoutInput = z.infer<typeof checkoutSchema>;
