"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { useCartStore } from "@/stores/cartStore";
import { useState } from "react";
import SupportModal from "./SupportModal";

export default function B2BHeroSection() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { getItemCount } = useCartStore();
  const [showTooltip, setShowTooltip] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  const cartItemsCount = getItemCount();

  const handleStartShopping = () => {
    if (typeof window !== "undefined" && window.analytics) {
      window.analytics.track("b2b_hero_cta_clicked", { button: "start_shopping" });
    }

    const catalogSection = document.getElementById("catalog-section");
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/b2b/catalog");
    }
  };

  return (
    <section className="bg-gradient-to-r from-primary via-primary to-blue-800 text-white py-16 md:py-24 lg:py-32">
      <div className="container-app">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            <Zap size={16} className="text-yellow-300" />
            <span className="text-sm font-semibold text-white">
              Trusted by 500+ workshops across India
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Genuine Auto Parts for
            <span className="text-accent"> Professional Mechanics</span>
          </h1>

          <p className="text-lg md:text-xl text-blue-100 mb-10 leading-relaxed max-w-2xl">
            Scale your workshop with bulk pricing, dedicated account managers, and
            express delivery. Everything mechanics and garages need to grow their
            business.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                onClick={handleStartShopping}
                onMouseEnter={() => isAuthenticated && cartItemsCount > 0 && setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                aria-label="Start shopping and browse our catalog"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-8 rounded-lg transition-all hover:scale-105 transform"
              >
                Start Shopping <ArrowRight size={20} />
              </motion.button>

              {isAuthenticated && cartItemsCount > 0 && showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-neutral-900 text-white text-sm px-3 py-2 rounded whitespace-nowrap flex items-center gap-2"
                >
                  <ShoppingBag size={14} />
                  You have {cartItemsCount} item{cartItemsCount !== 1 ? "s" : ""} in your cart
                </motion.div>
              )}
            </div>

            <button
              onClick={() => setShowSupportModal(true)}
              className="inline-flex items-center justify-center gap-2 border-2 border-white hover:bg-white/10 text-white font-semibold py-4 px-8 rounded-lg transition-colors"
            >
              Get Expert Help
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 mt-16 pt-12 border-t border-white/20">
            <div>
              <p className="text-3xl md:text-4xl font-bold">50K+</p>
              <p className="text-blue-100 text-sm md:text-base">Parts in Stock</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold">24-48h</p>
              <p className="text-blue-100 text-sm md:text-base">Delivery</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold">25%</p>
              <p className="text-blue-100 text-sm md:text-base">Max Discount</p>
            </div>
          </div>
        </div>
      </div>

      <SupportModal isOpen={showSupportModal} onClose={() => setShowSupportModal(false)} />
    </section>
  );
}
