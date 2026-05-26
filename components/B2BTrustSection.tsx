import { FileText, Clock, Zap, BarChart3 } from "lucide-react";

const benefits = [
  {
    icon: FileText,
    title: "GST Invoicing",
    description: "Automated invoice generation for easy accounting and GST compliance.",
  },
  {
    icon: Clock,
    title: "Credit Terms",
    description: "Pay later with flexible credit terms from 15-30 days based on your tier.",
  },
  {
    icon: Zap,
    title: "Fast Fulfillment",
    description:
      "Priority order processing and express delivery to minimize downtime.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track spending, popular parts, and manage inventory efficiently.",
  },
];

export default function B2BTrustSection() {
  return (
    <section className="bg-neutral-50 py-12 md:py-16">
      <div className="container-app">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">
            B2B Excellence
          </h2>
          <p className="text-neutral-600">
            Tools and support to run your business smoothly
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="card p-6 text-center">
                <Icon size={32} className="text-secondary mx-auto mb-4" />
                <h3 className="font-semibold text-neutral-900 text-lg mb-2">
                  {benefit.title}
                </h3>
                <p className="text-neutral-600 text-sm">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* Partner Showcase */}
        <div className="bg-white card p-8 text-center">
          <h3 className="text-2xl font-bold text-neutral-900 mb-6">
            Trusted by Leading Mechanics & Garages
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            {["AutoPro Delhi", "Raj Garage Mumbai", "Expert Repairs Bangalore", "QuickFix Chennai"].map(
              (name) => (
                <div key={name} className="px-4 py-6 border border-neutral-200 rounded-lg bg-neutral-50">
                  <p className="font-semibold text-neutral-700">{name}</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
