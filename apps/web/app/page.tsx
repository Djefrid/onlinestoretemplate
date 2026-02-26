import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { BentoGrid } from "@/components/home/BentoGrid";
import { BestSellers } from "@/components/home/BestSellers";
import { getSiteSettings } from "@/lib/sanity/siteSettings";

export default async function HomePage() {
  const settings = await getSiteSettings();

  return (
    <>
      <Hero
        heroTitle={settings.hero?.heroTitle}
        heroSubtitle={settings.hero?.heroSubtitle}
        bannerUrl={settings.hero?.bannerUrl}
        bannerAlt={settings.hero?.bannerAlt}
      />
      <TrustBar />
      <BentoGrid />
      <BestSellers />
    </>
  );
}
