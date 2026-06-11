import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section data-testid="b2c-hero-section" className="bg-gradient-to-r from-secondary to-blue-800 text-white py-12 md:py-20">
      <div className="container-app">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Genuine Spare Parts,
            <br />
            <span className="text-primary">Trusted Since Day One</span>
          </h1>
          <p className="text-lg text-blue-100 mb-8 leading-relaxed">
            Find authentic spare parts for your vehicle with expert verification,
            real-time tracking, and seamless support from mechanics who care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              data-testid="b2c-hero-start-shopping"
              href="/shop/products"
              className="btn-primary bg-primary hover:bg-orange-700 flex items-center justify-center gap-2"
            >
              Start Shopping <ArrowRight size={18} />
            </Link>
            <Link
              data-testid="b2c-hero-expert-help"
              href="/shop/support"
              className="btn-outline bg-white/10 border-white text-white hover:bg-white/20"
            >
              Get Expert Help
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
