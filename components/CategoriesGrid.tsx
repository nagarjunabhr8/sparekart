import Link from "next/link";
import {
  Cog,
  Disc,
  Activity,
  Zap,
  Thermometer,
  Droplet,
  Wind,
  Filter,
} from "lucide-react";

const categories = [
  { name: "Engine Parts", icon: Cog, count: "2,340 parts", color: "text-red-600" },
  { name: "Brakes", icon: Disc, count: "1,890 parts", color: "text-orange-600" },
  { name: "Suspension", icon: Activity, count: "1,560 parts", color: "text-blue-600" },
  { name: "Electrical", icon: Zap, count: "2,120 parts", color: "text-yellow-600" },
  {
    name: "Cooling System",
    icon: Thermometer,
    count: "890 parts",
    color: "text-cyan-600",
  },
  { name: "Fuel System", icon: Droplet, count: "750 parts", color: "text-green-600" },
  { name: "Air Filters", icon: Wind, count: "1,200 parts", color: "text-purple-600" },
  { name: "Oil Filters", icon: Filter, count: "980 parts", color: "text-teal-600" },
];

export default function CategoriesGrid() {
  return (
    <section data-testid="b2c-categories-section" className="bg-neutral-50 py-12 md:py-16 border-b border-neutral-200">
      <div className="container-app">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">
              Shop by Category
            </h2>
            <p className="text-neutral-600">
              Browse our extensive collection of genuine parts
            </p>
          </div>
          <Link
            data-testid="b2c-categories-view-all"
            href="/shop/products"
            className="text-primary font-semibold hover:text-orange-700 transition-colors self-center sm:self-auto"
          >
            View All →
          </Link>
        </div>

        <div data-testid="b2c-categories-grid" className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            const slug = category.name.toLowerCase().replace(/\s+/g, "-");
            return (
              <Link
                data-testid={`b2c-category-${slug}`}
                key={category.name}
                href={`/shop/products?category=${encodeURIComponent(category.name)}`}
                className="card p-4 cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-lg"
              >
                <div className="flex flex-col items-center text-center">
                  <Icon size={32} className={`${category.color} mb-3`} />
                  <h3 className="font-semibold text-neutral-900 text-sm mb-1">
                    {category.name}
                  </h3>
                  <p className="text-xs text-neutral-500">{category.count}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
