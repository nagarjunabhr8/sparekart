import { Check } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "Starter",
    description: "Perfect for small repairs and individual orders",
    monthlySpend: "₹0-50K",
    discount: "5%",
    features: [
      "Online catalog access",
      "Standard delivery",
      "Email support",
      "Basic reporting",
    ],
  },
  {
    name: "Professional",
    description: "Ideal for active mechanics and small shops",
    monthlySpend: "₹50K-2L",
    discount: "15%",
    features: [
      "Everything in Starter",
      "Priority delivery",
      "Dedicated account manager",
      "Advanced reporting",
      "GST invoicing",
      "Credit terms (15 days)",
    ],
    highlight: true,
  },
  {
    name: "Enterprise",
    description: "For large garages and workshop chains",
    monthlySpend: "₹2L+",
    discount: "25%",
    features: [
      "Everything in Professional",
      "Express delivery",
      "API integration",
      "Custom pricing",
      "Inventory management",
      "Extended credit terms (30 days)",
      "Dedicated success manager",
    ],
  },
];

export default function PricingTiers() {
  return (
    <section className="bg-white py-12 md:py-16 border-b border-neutral-200">
      <div className="container-app">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">
            Flexible Pricing Plans
          </h2>
          <p className="text-neutral-600">
            Scale with your business, save as you grow
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`card p-6 flex flex-col ${
                tier.highlight
                  ? "md:scale-105 border-primary border-2 shadow-lg"
                  : "border border-neutral-100"
              }`}
            >
              {tier.highlight && (
                <div className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                {tier.name}
              </h3>
              <p className="text-sm text-neutral-600 mb-6">{tier.description}</p>

              <div className="mb-6">
                <p className="text-sm text-neutral-600 mb-2">
                  Monthly Spend
                </p>
                <p className="text-2xl font-bold text-neutral-900 mb-4">
                  {tier.monthlySpend}
                </p>
                <div className="bg-primary/10 px-4 py-2 rounded-lg">
                  <p className="text-sm text-neutral-700">
                    <span className="font-bold text-primary">
                      {tier.discount} discount
                    </span>{" "}
                    on all parts
                  </p>
                </div>
              </div>

              <div className="flex-1 mb-6">
                <h4 className="font-semibold text-neutral-900 mb-4">Features:</h4>
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check size={18} className="text-success flex-shrink-0 mt-1" />
                      <span className="text-sm text-neutral-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/b2b/signup"
                className={`btn-primary text-center font-semibold py-3 rounded-lg transition-colors ${
                  tier.highlight
                    ? "bg-primary hover:bg-orange-700 text-white"
                    : "btn-outline border-primary text-primary hover:bg-primary/10"
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
