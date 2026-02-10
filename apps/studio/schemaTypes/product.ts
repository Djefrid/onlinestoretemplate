import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Produit",
  type: "document",
  icon: () => "🛒",
  fields: [
    defineField({
      name: "title",
      title: "Nom du produit",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "price",
      title: "Prix",
      type: "number",
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: "currency",
      title: "Devise",
      type: "string",
      initialValue: "CAD",
      options: {
        list: [
          { title: "Dollar canadien (CAD)", value: "CAD" },
          { title: "Euro (EUR)", value: "EUR" },
        ],
      },
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              title: "Texte alternatif",
              type: "string",
            },
          ],
        },
      ],
      validation: (r) => r.min(1),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "category",
      title: "Catégorie",
      type: "reference",
      to: [{ type: "category" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Bio", value: "Bio" },
          { title: "Pimenté", value: "Pimenté" },
          { title: "Surgelé", value: "Surgelé" },
        ],
      },
    }),
    defineField({
      name: "originCountry",
      title: "Pays d'origine",
      type: "string",
      options: {
        list: [
          "Cameroun 🇨🇲",
          "Côte d'Ivoire 🇨🇮",
          "Sénégal 🇸🇳",
          "Nigeria 🇳🇬",
          "Ghana 🇬🇭",
          "Congo 🇨🇬",
          "RDC 🇨🇩",
          "Mali 🇲🇱",
          "Guinée 🇬🇳",
          "Bénin 🇧🇯",
        ],
      },
    }),
    defineField({
      name: "spicyLevel",
      title: "Niveau de piquant (0-3)",
      type: "number",
      initialValue: 0,
      validation: (r) => r.min(0).max(3),
      options: {
        list: [
          { title: "Pas piquant", value: 0 },
          { title: "Doux", value: 1 },
          { title: "Moyen", value: 2 },
          { title: "Fort", value: 3 },
        ],
      },
    }),
    defineField({
      name: "isFrozen",
      title: "Surgelé",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isOrganic",
      title: "Bio",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "stock",
      title: "Stock",
      type: "number",
      initialValue: 0,
      validation: (r) => r.min(0),
    }),
    defineField({
      name: "isFeatured",
      title: "Produit vedette (Best-seller)",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "relatedProducts",
      title: "Produits associés",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
      validation: (r) => r.max(4),
    }),
  ],
  preview: {
    select: {
      title: "title",
      price: "price",
      currency: "currency",
      media: "images.0",
    },
    prepare({ title, price, currency, media }) {
      return {
        title,
        subtitle: `${price ?? "?"} ${currency ?? "CAD"}`,
        media,
      };
    },
  },
});
