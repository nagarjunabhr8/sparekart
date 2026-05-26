import Link from "next/link";
import { Check, Zap } from "lucide-react";

const plans = [
  {
    name: "Starter",
    description: "Perfect for solo mechanics and small independent shops",
    monthlySpend: "₹0 - 50K",
    discount: "5%",
    monthlySpendValue: 50000,
    features: [
      "Online catalog access",
      "Standard delivery (5-7 days)",
      "Email support",
      "Basic order history",
      "Invoice generation",
    ],
    cta: "Get Started",
    ctaVariant: "secondary",
  },
  {
    name: "Professional",
    description: "Ideal for active mechanics and established repair shops",
    monthlySpend: "₹50K - 2L",
    discount: "15%",
    monthlySpendValue: 200000,
    features: [
      "Everything in Starter",
      "Priority delivery (2-3 days)",
      "Dedicated account manager",
      "Advanced analytics dashboard",
      "Custom pricing negotiations",
      "Credit terms (15 days)",
      "GST invoice support",
      "24/7 phone support",
    ],
    cta: "Start Free Trial",
    ctaVariant: "primary",
    highlight: true,
  },
  {
    name: "Enterprise",
    description: "For large workshop chains and regional operators",
    monthlySpend: "₹2L+",
    discount: "25%",
    monthlySpendValue: 200001,
    features: [
      "Everything in Professional",
      "Express delivery (24 hours)",
      "Dedicated success manager",
      "API integration available",
      "Custom pricing & terms",
      "Extended credit (30 days)",
      "Inventory management tools",
      "Priority technical support",
      "Quarterly business reviews",
    ],
    cta: "Talk to Sales",
    ctaVariant: "primary",
  },
];

export default function B2BPricingPlans() {
  return (
    <section className="py-16 md:py-24 bg-white border-b border-slate-200">
      <div className="container-app">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Flexible Pricing Plans
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Scale your business and save more as you grow with us
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`card flex flex-col overflow-hidden transition-all duration-300 ${
                plan.highlight
                  ? "md:scale-105 border-2 border-accent shadow-2xl"
                  : "border border-slate-200"
              }`}
            >
              {/* Header */}
              <div className="p-6 md:p-8 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
                {plan.highlight && (
                  <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-3 py-1 rounded-full mb-4">
                    <Zap size={14} />
                    <span className="text-xs font-bold">Most Popular</span>
                  </div>
                )}
                <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-neutral-600 mb-6">{plan.description}</p>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs uppercase text-neutral-500 font-semibold mb-1">
                      Monthly Spend
                    </p>
                    <p className="text-2xl font-bold text-neutral-900">
                      {plan.monthlySpend}
                    </p>
                  </div>
                  <div className="bg-primary/10 px-4 py-3 rounded-lg border border-primary/20">
                    <p className="text-sm text-neutral-700">
                      <span className="font-bold text-primary text-base">
                        {plan.discount} discount
                      </span>{" "}
                      on all parts
                    </p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="p-6 md:p-8 flex-1">
                <h4 className="font-bold text-neutral-900 mb-4 text-sm uppercase text-neutral-500">
                  What's Included
                </h4>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        size={18}
                        className="text-emerald-600 flex-shrink-0 mt-0.5"
                      />
                      <span className="text-neutral-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="p-6 md:p-8 border-t border-slate-200 bg-slate-50">
                <Link
                  href={`/b2b/signup?plan=${plan.name.toLowerCase()}`}
                  className={`block w-full py-3 px-4 rounded-lg font-semibold text-center transition-colors ${
                    plan.ctaVariant === "primary"
                      ? "bg-primary hover:bg-blue-900 text-white"
                      : "border-2 border-primary text-primary hover:bg-primary/5"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 md:mt-16 bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <p className="text-neutral-700 mb-4">
            Not sure which plan is right for you?
          </p>
          <Link
            href="/b2b/contact-sales"
            className="inline-flex items-center gap-2 text-primary hover:text-blue-900 font-semibold"
          >
            Schedule a consultation with our sales team →
          </Link>
        </div>
      </div>
    </section>
  );
}
