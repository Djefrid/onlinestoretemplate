import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Épicerie Africaine — L'Afrique authentique, livrée à votre porte",
    template: "%s | Épicerie Africaine",
  },
  description:
    "Épices rares, produits frais et soins naturels importés directement du continent africain. Livraison rapide au Canada.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ),
  openGraph: {
    type: "website",
    locale: "fr_CA",
    siteName: "Épicerie Africaine",
    title: "Épicerie Africaine — L'Afrique authentique, livrée à votre porte",
    description:
      "Épices rares, produits frais et soins naturels importés directement du continent africain.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <Providers>
          <Header />
          <main className="flex-1 pt-16 sm:pt-20">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
