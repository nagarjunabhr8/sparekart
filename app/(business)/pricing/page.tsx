"use client";

import { Suspense } from "react";
import BulkPricingCalculator from "@/components/B2B/BulkPricingCalculator";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div data-testid="pricing-page" className="min-h-screen bg-white">

      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-primary to-blue-800 text-white py-12 md:py-16">
        <div className="container-app">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6"
          >
            <ChevronLeft size={20} />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            B2B Bulk Pricing
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Save more as you scale. Our tiered pricing rewards your loyalty with increasing discounts.
          </p>
        </div>
      </div>

      {/* Bulk Pricing Calculator */}
      <Suspense fallback={<div className="py-16 text-center">Loading calculator...</div>}>
        <BulkPricingCalculator />
      </Suspense>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-200">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-neutral-600">
              Everything you need to know about our bulk pricing
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div>
              <h3 className="font-bold text-neutral-900 mb-2">
                How is monthly spend calculated?
              </h3>
              <p className="text-neutral-600 text-sm">
                Your monthly spend is the total value of all orders placed within a calendar month. Discounts are applied at checkout based on your current tier.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-neutral-900 mb-2">
                When do I get upgraded to a higher tier?
              </h3>
              <p className="text-neutral-600 text-sm">
                Your tier is automatically updated when your monthly spending reaches the threshold. Upgrades take effect immediately for all subsequent orders.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-neutral-900 mb-2">
                Do discounts stack with other offers?
              </h3>
              <p className="text-neutral-600 text-sm">
                Bulk pricing discounts are the primary discount and don't stack with promotional offers. We'll always apply the best available rate for you.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-neutral-900 mb-2">
                Can I downgrade from a higher tier?
              </h3>
              <p className="text-neutral-600 text-sm">
                Your tier is based on your monthly spending. If spending decreases, your tier will adjust accordingly in the following month.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-neutral-900 mb-2">
                Is there a contract or minimum commitment?
              </h3>
              <p className="text-neutral-600 text-sm">
                No contracts or minimums required. You can cancel anytime. Pricing benefits apply automatically based on your actual spending.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-neutral-900 mb-2">
                How do bulk discounts affect GST?
              </h3>
              <p className="text-neutral-600 text-sm">
                GST is calculated on the discounted price. You get tax benefits from lower pricing. Detailed breakdowns are shown on all invoices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-app text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
            Ready to Save More?
          </h2>
          <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
            Join thousands of mechanics and workshops already saving with SpareKart B2B
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-primary text-white font-bold rounded-lg hover:bg-blue-900 transition-colors"
            >
              Register as B2B Now
            </Link>
            <Link
              href="/catalog"
              className="px-8 py-4 border-2 border-primary text-primary font-bold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
