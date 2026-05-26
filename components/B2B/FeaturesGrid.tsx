"use client";

import { BarChart3, TrendingDown, Users, Zap, Clock, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CostControlModal from "./CostControlModal";

const features = [
  {
    icon: BarChart3,
    title: "Bulk Pricing",
    description: "Tiered discounts up to 25% for large orders. More you buy, more you save.",
    color: "text-blue-600",
  },
  {
    icon: TrendingDown,
    title: "Cost Control",
    description: "Transparent pricing with detailed invoicing and no hidden charges ever.",
    color: "text-emerald-600",
  },
  {
    icon: Users,
    title: "Dedicated Support",
    description: "Personal account managers to handle inventory and ordering efficiently.",
    color: "text-purple-600",
  },
  {
    icon: Zap,
    title: "Quick Onboarding",
    description: "Get verified and start ordering within 24 hours. No hassle, no delays.",
    color: "text-yellow-600",
  },
  {
    icon: Clock,
    title: "Fast Delivery",
    description: "Express delivery options available. Get parts when your workshops need them.",
    color: "text-red-600",
  },
  {
    icon: ShieldCheck,
    title: "Quality Guarantee",
    description:
      "100% authentic parts with manufacturer warranties backed by our guarantee.",
    color: "text-indigo-600",
  },
];

export default function B2BFeaturesGrid() {
  const router = useRouter();
  const [tooltipActive, setTooltipActive] = useState<string | null>(null);
  const [showCostControlModal, setShowCostControlModal] = useState(false);

  const handleBulkPricingClick = () => {
    router.push("/b2b/pricing");
  };

  const handleCostControlClick = () => {
    setShowCostControlModal(true);
  };

  const handleDedicatedSupportClick = () => {
    router.push("/b2b/support");
  };

  const handleQuickOnboardingClick = () => {
    router.push("/b2b/register");
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
      <div className="container-app">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Built for Professionals
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Everything your workshop needs to operate efficiently and profitably
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isBulkPricing = feature.title === "Bulk Pricing";
            const isCostControl = feature.title === "Cost Control";
            const isDedicatedSupport = feature.title === "Dedicated Support";
            const isQuickOnboarding = feature.title === "Quick Onboarding";
            const isClickable = isBulkPricing || isCostControl || isDedicatedSupport || isQuickOnboarding;

            return (
              <div
                key={feature.title}
                className={`card p-6 md:p-8 border border-slate-100 transition-all duration-300 relative ${
                  isClickable
                    ? "cursor-pointer hover:shadow-xl hover:-translate-y-1"
                    : "hover:shadow-lg"
                }`}
                onClick={
                  isBulkPricing
                    ? handleBulkPricingClick
                    : isCostControl
                    ? handleCostControlClick
                    : isDedicatedSupport
                    ? handleDedicatedSupportClick
                    : isQuickOnboarding
                    ? handleQuickOnboardingClick
                    : undefined
                }
                onMouseEnter={() => {
                  if (isBulkPricing) setTooltipActive("bulk-pricing");
                  else if (isCostControl) setTooltipActive("cost-control");
                  else if (isDedicatedSupport) setTooltipActive("dedicated-support");
                  else if (isQuickOnboarding) setTooltipActive("quick-onboarding");
                }}
                onMouseLeave={() => setTooltipActive(null)}
              >
                <Icon
                  size={40}
                  className={`${
                    (isBulkPricing && tooltipActive === "bulk-pricing") ||
                    (isCostControl && tooltipActive === "cost-control") ||
                    (isDedicatedSupport && tooltipActive === "dedicated-support") ||
                    (isQuickOnboarding && tooltipActive === "quick-onboarding")
                      ? "text-orange-500"
                      : feature.color
                  } mb-6 transition-colors duration-300`}
                />
                <h3 className="text-xl font-bold text-neutral-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Tooltips */}
                {isBulkPricing && tooltipActive === "bulk-pricing" && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-neutral-900 text-white text-sm px-3 py-2 rounded whitespace-nowrap z-10">
                    Save up to 25% on all orders with bulk B2B pricing
                  </div>
                )}
                {isCostControl && tooltipActive === "cost-control" && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-neutral-900 text-white text-sm px-3 py-2 rounded whitespace-nowrap z-10">
                    Track spending, set budgets, and control costs
                  </div>
                )}
                {isDedicatedSupport && tooltipActive === "dedicated-support" && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-neutral-900 text-white text-sm px-3 py-2 rounded whitespace-nowrap z-10">
                    Get dedicated support from your account manager
                  </div>
                )}
                {isQuickOnboarding && tooltipActive === "quick-onboarding" && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-neutral-900 text-white text-sm px-3 py-2 rounded whitespace-nowrap z-10">
                    Get verified and start ordering within 24 hours
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <CostControlModal isOpen={showCostControlModal} onClose={() => setShowCostControlModal(false)} />
    </section>
  );
}
