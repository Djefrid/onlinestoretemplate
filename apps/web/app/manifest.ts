import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: process.env.NEXT_PUBLIC_SITE_NAME || "Hawa Exotiques",
    short_name: "Hawa",
    description:
      "Épices rares, produits frais et soins naturels importés directement du continent africain.",
    start_url: "/",
    display: "standalone",
    background_color: "#F9F9F7",
    theme_color: "#CCA43B",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
