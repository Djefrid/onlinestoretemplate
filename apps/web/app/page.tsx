import { Hero } from "@/components/home/Hero";
import { BentoGrid } from "@/components/home/BentoGrid";
import { BestSellers } from "@/components/home/BestSellers";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BentoGrid />
      <BestSellers />
    </>
  );
}
