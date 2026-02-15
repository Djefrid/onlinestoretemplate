import { defineField, defineType } from "sanity";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Configuration Boutique",
  type: "document",
  icon: () => "⚙️",
  groups: [
    { name: "identity", title: "Identité", default: true },
    { name: "contact", title: "Contact" },
    { name: "location", title: "Localisation" },
    { name: "hours", title: "Horaires" },
    { name: "delivery", title: "Livraison / Retrait" },
    { name: "announcement", title: "Annonce" },
    { name: "hero", title: "Page d'accueil" },
    { name: "status", title: "Statut boutique" },
    { name: "socials", title: "Réseaux sociaux" },
  ],
  fields: [
    // ── A) Identité ──────────────────────────
    defineField({
      name: "shopName",
      title: "Nom de la boutique",
      type: "string",
      group: "identity",
      validation: (r) => r.required().error("Le nom de la boutique est obligatoire"),
    }),
    defineField({
      name: "tagline",
      title: "Slogan",
      type: "string",
      group: "identity",
      description: "Ex: « L'Afrique authentique, livrée à votre porte. »",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      group: "identity",
      options: { hotspot: true },
    }),

    // ── B) Contact ───────────────────────────
    defineField({
      name: "email",
      title: "Email principal",
      type: "string",
      group: "contact",
      validation: (r) =>
        r.regex(emailRegex, { name: "email", invert: false }).error("Format email invalide"),
    }),
    defineField({
      name: "supportEmail",
      title: "Email support / confidentialité",
      type: "string",
      group: "contact",
      description: "Pour les questions de vie privée et les réclamations",
      validation: (r) =>
        r.regex(emailRegex, { name: "email", invert: false }).error("Format email invalide"),
    }),
    defineField({
      name: "phone",
      title: "Téléphone",
      type: "string",
      group: "contact",
      description: "Format recommandé : +1 514 123-4567",
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp",
      type: "string",
      group: "contact",
      description: "Numéro au format international (ex: +15141234567)",
    }),

    // ── C) Localisation ──────────────────────
    defineField({
      name: "addressLine1",
      title: "Adresse ligne 1",
      type: "string",
      group: "location",
    }),
    defineField({
      name: "addressLine2",
      title: "Adresse ligne 2",
      type: "string",
      group: "location",
    }),
    defineField({
      name: "city",
      title: "Ville",
      type: "string",
      group: "location",
    }),
    defineField({
      name: "province",
      title: "Province",
      type: "string",
      group: "location",
      initialValue: "QC",
    }),
    defineField({
      name: "postalCode",
      title: "Code postal",
      type: "string",
      group: "location",
    }),
    defineField({
      name: "country",
      title: "Pays",
      type: "string",
      group: "location",
      initialValue: "Canada",
    }),
    defineField({
      name: "googleMapsUrl",
      title: "Lien Google Maps",
      type: "url",
      group: "location",
    }),

    // ── D) Horaires ──────────────────────────
    defineField({
      name: "openingHours",
      title: "Horaires d'ouverture",
      type: "text",
      group: "hours",
      rows: 6,
      description:
        "Ex:\nLundi – Vendredi : 10h – 19h\nSamedi : 10h – 17h\nDimanche : Fermé",
    }),

    // ── E) Livraison / Retrait ───────────────
    defineField({
      name: "deliveryZones",
      title: "Zones de livraison",
      type: "text",
      group: "delivery",
      rows: 6,
      description: "Zones desservies, délais et conditions",
    }),
    defineField({
      name: "pickupInstructions",
      title: "Instructions de retrait",
      type: "text",
      group: "delivery",
      rows: 6,
      description: "Adresse, créneaux, délai de conservation, etc.",
    }),

    // ── F) Barre d'annonce ───────────────────
    defineField({
      name: "announcementBar",
      title: "Barre d'annonce",
      type: "object",
      group: "announcement",
      fields: [
        defineField({
          name: "enabled",
          title: "Activée",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "text",
          title: "Texte",
          type: "string",
          description: "Ex: « Livraison gratuite dès 75$ d'achat ! »",
        }),
        defineField({
          name: "linkLabel",
          title: "Texte du lien",
          type: "string",
        }),
        defineField({
          name: "linkUrl",
          title: "URL du lien",
          type: "url",
          validation: (r) =>
            r.uri({ allowRelative: true, scheme: ["http", "https"] }),
        }),
      ],
    }),

    // ── G) Hero page d'accueil ───────────────
    defineField({
      name: "bannerImage",
      title: "Image hero",
      type: "image",
      group: "hero",
      options: { hotspot: true },
      description: "Image de fond du hero (optionnel, gradient par défaut si vide)",
    }),
    defineField({
      name: "bannerAlt",
      title: "Texte alternatif image hero",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroTitle",
      title: "Titre hero",
      type: "string",
      group: "hero",
      initialValue: "L'Afrique authentique, livrée à votre porte.",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Sous-titre hero",
      type: "text",
      group: "hero",
      rows: 3,
      initialValue:
        "Épices rares, produits frais et soins naturels importés directement du continent africain.",
    }),

    // ── H) Statut boutique ───────────────────
    defineField({
      name: "shopStatus",
      title: "Statut de la boutique",
      type: "object",
      group: "status",
      fields: [
        defineField({
          name: "isOpen",
          title: "Boutique ouverte",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "closedMessage",
          title: "Message de fermeture",
          type: "text",
          rows: 3,
          description: "Affiché quand la boutique est fermée",
        }),
        defineField({
          name: "reopenDate",
          title: "Date de réouverture",
          type: "date",
        }),
      ],
    }),

    // ── I) Réseaux sociaux ───────────────────
    defineField({
      name: "instagram",
      title: "Instagram",
      type: "url",
      group: "socials",
    }),
    defineField({
      name: "facebook",
      title: "Facebook",
      type: "url",
      group: "socials",
    }),
    defineField({
      name: "tiktok",
      title: "TikTok",
      type: "url",
      group: "socials",
    }),
    defineField({
      name: "youtube",
      title: "YouTube",
      type: "url",
      group: "socials",
    }),
  ],
  preview: {
    select: { title: "shopName" },
    prepare({ title }) {
      return { title: title || "Configuration Boutique", subtitle: "⚙️ Paramètres du site" };
    },
  },
});
