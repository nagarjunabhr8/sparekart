import { BarChart3, TrendingDown, Users, Zap } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Bulk Pricing",
    description: "Tiered discounts up to 40% for bulk orders and regular purchases.",
  },
  {
    icon: TrendingDown,
    title: "Cost Control",
    description: "Transparent pricing with detailed cost breakdowns and no hidden charges.",
  },
  {
    icon: Users,
    title: "Dedicated Support",
    description: "Account managers to help you manage orders and inventory efficiently.",
  },
  {
    icon: Zap,
    title: "Quick Onboarding",
    description: "Get verified and start ordering within 24 hours of registration.",
  },
];

export default function B2BFeatures() {
  return (
    <section className="bg-white py-12 md:py-16 border-b border-neutral-200">
      <div className="container-app">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">
            Built for Professionals
          </h2>
          <p className="text-neutral-600">
            Features designed for mechanics, shops, and garages
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="card p-6">
                <Icon size={32} className="text-secondary mb-4" />
                <h3 className="font-semibold text-neutral-900 text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
