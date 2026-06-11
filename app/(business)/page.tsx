import { Metadata, Viewport } from "next";
import { Suspense } from "react";
import B2BHeroSection from "@/components/B2B/HeroSection";
import B2BFeaturesGrid from "@/components/B2B/FeaturesGrid";
import B2BPricingPlans from "@/components/B2B/PricingPlans";
import B2BTrustedPartners from "@/components/B2B/TrustedPartners";
import {
  HeroSkeleton,
  FeaturesGridSkeleton,
  PricingGridSkeleton,
  TrustedPartnersSkeleton,
} from "@/components/Skeletons";

export const metadata: Metadata = {
  title: "SpareKart B2B — Genuine Auto Parts for Professionals",
  description:
    "Bulk ordering solutions for mechanics, garages, and auto workshops. Competitive pricing, dedicated support, and quick delivery across India.",
  keywords: [
    "B2B spare parts",
    "bulk auto parts",
    "mechanics supplies",
    "garage supplies",
    "wholesale auto parts India",
  ],
  robots: "index, follow",
  openGraph: {
    title: "SpareKart B2B — Genuine Auto Parts for Professionals",
    description:
      "Bulk ordering solutions for mechanics and garages with dedicated support.",
    url: "https://sparekart.com/b2b",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function B2BHome() {
  return (
    <div className="bg-white">
      <Suspense fallback={<HeroSkeleton />}>
        <B2BHeroSection />
      </Suspense>

      <Suspense fallback={<FeaturesGridSkeleton />}>
        <B2BFeaturesGrid />
      </Suspense>

      <Suspense fallback={<PricingGridSkeleton />}>
        <B2BPricingPlans />
      </Suspense>

      <Suspense fallback={<TrustedPartnersSkeleton />}>
        <B2BTrustedPartners />
      </Suspense>
    </div>
  );
}
