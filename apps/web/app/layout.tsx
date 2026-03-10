import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { headers } from "next/headers";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { ShopClosedBanner } from "@/components/layout/ShopClosedBanner";
import { getSiteSettings } from "@/lib/sanity/siteSettings";
import { getCategories } from "@/lib/sanity/queries";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Analytics } from "@vercel/analytics/next";
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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const name = settings.shopName;
  const tagline = settings.tagline || "L'Afrique authentique, livrée à votre porte";
  const description =
    "Épices rares, produits frais et soins naturels importés directement du continent africain. Livraison rapide au Canada.";

  return {
    title: {
      default: `${name} — ${tagline}`,
      template: `%s | ${name}`,
    },
    description,
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    ),
    openGraph: {
      type: "website",
      locale: "fr_CA",
      siteName: name,
      title: `${name} — ${tagline}`,
      description,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    getCategories().catch(() => []),
  ]);
  const headersList = headers();
  const pathname = headersList.get("x-next-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin-hub");

  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
        />
      </head>
      <body className="flex min-h-screen flex-col font-sans">
        <Providers>
          {!isAdmin && (
            <>
              {settings.announcementBar?.enabled && (
                <AnnouncementBar bar={settings.announcementBar} />
              )}
              {settings.shopStatus && !settings.shopStatus.isOpen && (
                <ShopClosedBanner status={settings.shopStatus} />
              )}
              <Header
                shopName={settings.shopName}
                logoUrl={settings.logoUrl}
                categories={categories}
              />
              <CartDrawer />
            </>
          )}
          <main className={isAdmin ? "" : "flex-1 pt-24"}>
            {children}
          </main>
          {!isAdmin && <Footer settings={settings} categories={categories} />}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
