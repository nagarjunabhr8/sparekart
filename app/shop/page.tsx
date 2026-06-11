import Hero from "@/components/Hero";
import SmartPartsFinder from "@/components/SmartPartsFinder";
import FeaturedProducts from "@/components/FeaturedProducts";
import TrustSection from "@/components/TrustSection";
import CategoriesGrid from "@/components/CategoriesGrid";

export default function B2CHome() {
  return (
    <div data-testid="b2c-home-page" className="bg-white">
      <Hero />
      <SmartPartsFinder />
      <CategoriesGrid />
      <FeaturedProducts />
      <TrustSection />
    </div>
  );
}
