"use client";

import { useState } from "react";
import Link from "next/link";

interface PricingTier {
  minSpend: number;
  maxSpend: number;
  discount: number;
  label: string;
}

const pricingTiers: PricingTier[] = [
  { minSpend: 0, maxSpend: 50000, discount: 5, label: "Starter" },
  { minSpend: 50000, maxSpend: 200000, discount: 15, label: "Professional" },
  { minSpend: 200000, maxSpend: 5000000, discount: 25, label: "Enterprise" },
];

interface UserPlan {
  tier: string;
  discount: number;
}

export default function BulkPricingCalculator() {
  const [monthlySpend, setMonthlySpend] = useState(100000);

  const getTierFromSpend = (spend: number): PricingTier => {
    return (
      pricingTiers.find((tier) => spend >= tier.minSpend && spend <= tier.maxSpend) ||
      pricingTiers[pricingTiers.length - 1]
    );
  };

  const currentTier = getTierFromSpend(monthlySpend);
  const estimatedSavings = (monthlySpend * currentTier.discount) / 100;

  const getUserPlan = (): UserPlan | null => {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    const user = JSON.parse(userStr);
    if (user.plan === "Professional") return { tier: "Professional", discount: 15 };
    if (user.plan === "Enterprise") return { tier: "Enterprise", discount: 25 };
    return null;
  };

  const userPlan = getUserPlan();

  return (
    <section className="py-16 md:py-24 bg-white" id="bulk-pricing">
      <div className="container-app">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Calculate Your Bulk Pricing Savings
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            See how much you can save with our tiered B2B pricing structure
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg border border-slate-200 p-8 md:p-12">
          {/* Slider Input */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-neutral-700 mb-4">
              Estimated Monthly Spend
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="5000000"
                step="10000"
                value={monthlySpend}
                onChange={(e) => setMonthlySpend(Number(e.target.value))}
                className="flex-1 h-3 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="text-right min-w-[120px]">
                <p className="text-2xl font-bold text-primary">
                  ₹{(monthlySpend / 100000).toFixed(2)}L
                </p>
              </div>
            </div>
            <p className="text-xs text-neutral-600 mt-2">
              ₹0 — ₹50L range
            </p>
          </div>

          {/* Results */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {/* Discount Tier */}
            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <p className="text-sm font-medium text-neutral-600 mb-2">
                Your Discount Tier
              </p>
              <p className="text-3xl font-bold text-primary mb-1">
                {currentTier.discount}%
              </p>
              <p className="text-sm font-semibold text-neutral-700">
                {currentTier.label}
              </p>
            </div>

            {/* Monthly Savings */}
            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <p className="text-sm font-medium text-neutral-600 mb-2">
                Estimated Monthly Savings
              </p>
              <p className="text-3xl font-bold text-emerald-600">
                ₹{estimatedSavings.toFixed(0)}
              </p>
              <p className="text-xs text-neutral-600 mt-1">
                on ₹{monthlySpend.toFixed(0)}
              </p>
            </div>

            {/* Annual Savings */}
            <div className="bg-white rounded-lg p-6 border border-slate-200">
              <p className="text-sm font-medium text-neutral-600 mb-2">
                Estimated Annual Savings
              </p>
              <p className="text-3xl font-bold text-blue-600">
                ₹{(estimatedSavings * 12).toFixed(0)}
              </p>
              <p className="text-xs text-neutral-600 mt-1">
                if spend consistent
              </p>
            </div>
          </div>

          {/* Tier Breakdown */}
          <div className="bg-white rounded-lg p-6 border border-slate-200 mb-8">
            <h3 className="font-semibold text-neutral-900 mb-4">Pricing Tiers</h3>
            <div className="space-y-3">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.label}
                  className={`p-4 rounded-lg transition-all ${
                    currentTier.label === tier.label
                      ? "bg-blue-50 border-2 border-primary"
                      : "bg-slate-50 border border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-neutral-900">
                        {tier.label}
                      </p>
                      <p className="text-sm text-neutral-600">
                        ₹{(tier.minSpend / 100000).toFixed(1)}L — ₹{(tier.maxSpend / 100000).toFixed(0)}L monthly
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {tier.discount}%
                      </p>
                      <p className="text-xs text-neutral-600">discount</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          {userPlan ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <p className="text-sm text-green-700 mb-2">Your Current Plan</p>
              <p className="text-2xl font-bold text-green-900 mb-1">
                {userPlan.tier} ({userPlan.discount}% discount)
              </p>
              <p className="text-sm text-green-700">
                You're already getting the best rates!
              </p>
            </div>
          ) : (
            <Link
              href="/b2b/signup"
              className="block w-full py-4 bg-primary hover:bg-blue-900 text-white font-bold rounded-lg text-center transition-colors"
            >
              Get This Deal — Register as B2B
            </Link>
          )}
        </div>

        {/* Additional Benefits */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <span className="text-2xl font-bold text-primary">✓</span>
            </div>
            <h3 className="font-semibold text-neutral-900 mb-2">
              No Minimum Order
            </h3>
            <p className="text-neutral-600 text-sm">
              Get discounts on every purchase, regardless of order size
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <span className="text-2xl font-bold text-primary">✓</span>
            </div>
            <h3 className="font-semibold text-neutral-900 mb-2">
              Instant Access
            </h3>
            <p className="text-neutral-600 text-sm">
              Discounts apply immediately after B2B registration
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <span className="text-2xl font-bold text-primary">✓</span>
            </div>
            <h3 className="font-semibold text-neutral-900 mb-2">
              Flexible Tiers
            </h3>
            <p className="text-neutral-600 text-sm">
              Automatic upgrade as your spending increases
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
