import {
  Shield,
  Truck,
  RotateCcw,
  MessageCircle,
  Award,
  Lock,
} from "lucide-react";

const trustFeatures = [
  {
    icon: Shield,
    title: "100% Authentic",
    description:
      "Every part is verified by our expert team and backed by manufacturer certificates.",
    color: "text-blue-600",
  },
  {
    icon: Truck,
    title: "Fast & Reliable",
    description:
      "Get parts delivered in 24-48 hours to your city with real-time tracking.",
    color: "text-green-600",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description:
      "30-day hassle-free returns if you're not satisfied with your purchase.",
    color: "text-purple-600",
  },
  {
    icon: MessageCircle,
    title: "Expert Support",
    description:
      "Chat with certified mechanics who can help you choose the right part.",
    color: "text-orange-600",
  },
  {
    icon: Award,
    title: "Warranty",
    description:
      "Every part comes with manufacturer warranty and our quality guarantee.",
    color: "text-red-600",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    description:
      "Protected transactions with multiple payment options and buyer protection.",
    color: "text-teal-600",
  },
];

export default function TrustSection() {
  return (
    <section className="bg-neutral-50 py-12 md:py-16 border-b border-neutral-200">
      <div className="container-app">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">
            Why Trust SpareKart?
          </h2>
          <p className="text-neutral-600">
            Built on transparency, quality, and customer care
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="card p-6 text-center">
                <Icon size={40} className={`${feature.color} mx-auto mb-4`} />
                <h3 className="font-semibold text-neutral-900 text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Testimonials */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Rajesh Kumar",
              role: "Mechanic, Delhi",
              quote:
                "Finally found a platform where I can trust the parts quality. My customers are happier!",
              rating: 5,
            },
            {
              name: "Priya Sharma",
              role: "Vehicle Owner, Bangalore",
              quote:
                "The expert chat support helped me pick the exact right part for my car. Delivery was super fast.",
              rating: 5,
            },
            {
              name: "Suresh Auto Works",
              role: "Garage Owner, Mumbai",
              quote:
                "We switched completely to SpareKart for our bulk orders. The B2B pricing is unbeatable.",
              rating: 5,
            },
          ].map((testimonial) => (
            <div key={testimonial.name} className="card p-6">
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-accent text-lg">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-neutral-700 mb-4 italic">
                "{testimonial.quote}"
              </p>
              <p className="font-semibold text-neutral-900">
                {testimonial.name}
              </p>
              <p className="text-sm text-neutral-500">{testimonial.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
