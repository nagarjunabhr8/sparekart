import { Star, Users, Zap } from "lucide-react";

const partners = [
  {
    name: "AutoPro Delhi",
    type: "Multi-location Garage",
    location: "Delhi NCR",
    testimonial:
      "SpareKart has been a game-changer for our workshop. The bulk pricing alone saves us ₹2L+ annually.",
    rating: 5,
    partneredSince: "2022",
  },
  {
    name: "Raj Garage Mumbai",
    type: "Independent Mechanic Shop",
    location: "Mumbai",
    testimonial:
      "Quick delivery and authentic parts are exactly what we needed. Customer satisfaction improved 40%.",
    rating: 5,
    partneredSince: "2023",
  },
  {
    name: "Expert Repairs Bangalore",
    type: "Premium Repair Center",
    location: "Bangalore",
    testimonial:
      "The dedicated account manager makes ordering seamless. We can focus on what we do best.",
    rating: 5,
    partneredSince: "2023",
  },
  {
    name: "QuickFix Chennai",
    type: "High-Volume Workshop",
    location: "Chennai",
    testimonial:
      "Our inventory costs dropped by 30% with SpareKart's bulk discounts and smart ordering system.",
    rating: 5,
    partneredSince: "2024",
  },
];

const stats = [
  {
    icon: Users,
    label: "Active Workshops",
    value: "500+",
    color: "text-blue-600",
  },
  {
    icon: Zap,
    label: "Parts Delivered",
    value: "50K+",
    color: "text-orange-600",
  },
  {
    icon: Star,
    label: "Customer Rating",
    value: "4.9/5",
    color: "text-yellow-600",
  },
];

export default function B2BTrustedPartners() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
      <div className="container-app">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Trusted by Leading Workshops
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Thousands of mechanics and workshop owners rely on SpareKart
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 md:mb-16">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="card p-8 text-center border border-slate-100"
              >
                <Icon size={40} className={`${stat.color} mx-auto mb-4`} />
                <p className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
                  {stat.value}
                </p>
                <p className="text-neutral-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-6">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="card p-6 md:p-8 border border-slate-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">
                    {partner.name}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    {partner.type} • {partner.location}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex gap-1 justify-end mb-2">
                    {[...Array(partner.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-neutral-500">
                    Partner since {partner.partneredSince}
                  </p>
                </div>
              </div>

              <p className="text-neutral-700 italic">
                "{partner.testimonial}"
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 md:mt-16 bg-gradient-to-r from-primary to-blue-800 rounded-lg p-8 md:p-12 text-white text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Join 500+ Successful Workshops
          </h3>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Start saving on parts today and grow your business with SpareKart's
            professional solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-accent hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
              Browse Catalog Now
            </button>
            <button className="border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-lg transition-colors">
              Request Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
