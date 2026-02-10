import { defineField, defineType } from "sanity";

export const order = defineType({
  name: "order",
  title: "Commande",
  type: "document",
  icon: () => "📦",
  readOnly: true,
  fields: [
    defineField({
      name: "stripeSessionId",
      title: "Stripe Session ID",
      type: "string",
    }),
    defineField({
      name: "stripePaymentIntentId",
      title: "Stripe Payment Intent ID",
      type: "string",
    }),
    defineField({
      name: "status",
      title: "Statut",
      type: "string",
      initialValue: "pending",
      options: {
        list: [
          { title: "En attente", value: "pending" },
          { title: "Payée", value: "paid" },
          { title: "Expédiée", value: "shipped" },
          { title: "Livrée", value: "delivered" },
          { title: "Annulée", value: "cancelled" },
        ],
      },
    }),
    defineField({
      name: "customerName",
      title: "Nom du client",
      type: "string",
    }),
    defineField({
      name: "customerEmail",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "phone",
      title: "Téléphone",
      type: "string",
    }),
    defineField({
      name: "deliveryMode",
      title: "Mode de livraison",
      type: "string",
      options: {
        list: [
          { title: "Livraison", value: "delivery" },
          { title: "Retrait magasin", value: "pickup" },
        ],
      },
    }),
    defineField({
      name: "address",
      title: "Adresse de livraison",
      type: "object",
      fields: [
        { name: "line1", title: "Adresse ligne 1", type: "string" },
        { name: "line2", title: "Adresse ligne 2", type: "string" },
        { name: "city", title: "Ville", type: "string" },
        { name: "postalCode", title: "Code postal", type: "string" },
        { name: "province", title: "Province", type: "string" },
        { name: "country", title: "Pays", type: "string" },
      ],
      hidden: ({ parent }) => parent?.deliveryMode !== "delivery",
    }),
    defineField({
      name: "pickupSlot",
      title: "Créneau de retrait",
      type: "string",
      hidden: ({ parent }) => parent?.deliveryMode !== "pickup",
    }),
    defineField({
      name: "items",
      title: "Articles",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "productId", title: "ID Produit", type: "string" },
            { name: "slug", title: "Slug", type: "string" },
            { name: "name", title: "Nom", type: "string" },
            { name: "price", title: "Prix unitaire", type: "number" },
            { name: "quantity", title: "Quantité", type: "number" },
          ],
          preview: {
            select: { title: "name", quantity: "quantity", price: "price" },
            prepare({ title, quantity, price }) {
              return {
                title: `${title} × ${quantity}`,
                subtitle: `${(price * quantity).toFixed(2)} CAD`,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "totals",
      title: "Totaux",
      type: "object",
      fields: [
        { name: "subtotal", title: "Sous-total", type: "number" },
        { name: "shipping", title: "Livraison", type: "number" },
        { name: "total", title: "Total", type: "number" },
      ],
    }),
    defineField({
      name: "createdAt",
      title: "Date de création",
      type: "datetime",
    }),
  ],
  orderings: [
    {
      title: "Date (récent)",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      name: "customerName",
      email: "customerEmail",
      total: "totals.total",
      status: "status",
      date: "createdAt",
    },
    prepare({ name, email, total, status, date }) {
      const d = date ? new Date(date).toLocaleDateString("fr-CA") : "";
      return {
        title: `${name || email || "Client inconnu"} — ${total?.toFixed(2) ?? "?"} CAD`,
        subtitle: `${status ?? "pending"} · ${d}`,
      };
    },
  },
});
