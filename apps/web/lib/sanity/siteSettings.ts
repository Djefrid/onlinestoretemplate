import { sanityClient, isSanityConfigured } from "./client";
import type { SiteSettings } from "@/types";

const SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings"][0]{
    shopName,
    tagline,
    "logoUrl": logo.asset->url,
    email,
    supportEmail,
    phone,
    whatsapp,
    "address": {
      "line1": addressLine1,
      "line2": addressLine2,
      city,
      province,
      postalCode,
      country,
      googleMapsUrl
    },
    openingHours,
    deliveryZones,
    pickupInstructions,
    announcementBar {
      enabled,
      text,
      linkLabel,
      linkUrl
    },
    "hero": {
      "bannerUrl": bannerImage.asset->url,
      bannerAlt,
      heroTitle,
      heroSubtitle
    },
    shopStatus {
      isOpen,
      closedMessage,
      reopenDate
    },
    "socials": {
      instagram,
      facebook,
      tiktok,
      youtube
    }
  }
`;

const DEFAULT_SETTINGS: SiteSettings = {
  shopName: process.env.NEXT_PUBLIC_SITE_NAME || "Épicerie Africaine",
  tagline: "L'Afrique authentique, livrée à votre porte.",
  hero: {
    heroTitle: "L'Afrique authentique, livrée à votre porte.",
    heroSubtitle:
      "Épices rares, produits frais et soins naturels importés directement du continent africain.",
  },
  shopStatus: { isOpen: true },
  announcementBar: { enabled: false },
};

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSanityConfigured) {
    return DEFAULT_SETTINGS;
  }

  try {
    const settings = await sanityClient.fetch<SiteSettings | null>(
      SITE_SETTINGS_QUERY,
      {},
      { next: { revalidate: 60 } },
    );

    if (!settings) {
      return DEFAULT_SETTINGS;
    }

    return {
      ...DEFAULT_SETTINGS,
      ...settings,
      hero: { ...DEFAULT_SETTINGS.hero, ...settings.hero },
      shopStatus: {
        isOpen: settings.shopStatus?.isOpen ?? DEFAULT_SETTINGS.shopStatus!.isOpen,
        closedMessage: settings.shopStatus?.closedMessage,
        reopenDate: settings.shopStatus?.reopenDate,
      },
      announcementBar: {
        enabled: settings.announcementBar?.enabled ?? DEFAULT_SETTINGS.announcementBar!.enabled,
        text: settings.announcementBar?.text,
        linkLabel: settings.announcementBar?.linkLabel,
        linkUrl: settings.announcementBar?.linkUrl,
      },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}
