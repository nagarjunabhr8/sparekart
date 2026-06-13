"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useShopAuth } from "@/lib/shopAuthContext";

export default function Hero() {
  const { user, hydrated, isAuthenticated } = useShopAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Only treat as authenticated after mount to avoid hydration mismatch.
  const authed = mounted && hydrated && isAuthenticated;
  const firstName = user?.name?.split(" ")[0];

  return (
    <section
      data-testid="b2c-hero-section"
      className="bg-gradient-to-r from-secondary via-secondary to-blue-800 text-white py-14 md:py-24"
    >
      <div className="container-app">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            <ShieldCheck size={16} className="text-accent" />
            <span className="text-sm font-semibold">
              100% genuine parts · Trusted by 1,00,000+ vehicle owners
            </span>
          </div>

          {authed && (
            <p
              data-testid="b2c-hero-greeting"
              className="text-lg md:text-xl text-blue-50 mb-3 font-medium"
            >
              Welcome back,{" "}
              <span className="font-bold text-primary">{firstName}</span> 👋
            </p>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
            Genuine Spare Parts,
            <br />
            <span className="text-primary">Trusted Since Day One</span>
          </h1>
          <p className="text-lg text-blue-100 mb-8 leading-relaxed max-w-2xl">
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
            {authed ? (
              <Link
                data-testid="b2c-hero-orders"
                href="/shop/orders"
                className="btn-outline bg-white/10 border-white text-white hover:bg-white/20"
              >
                Track My Orders
              </Link>
            ) : (
              <Link
                data-testid="b2c-hero-register"
                href="/shop/register"
                className="btn-outline bg-white/10 border-white text-white hover:bg-white/20"
              >
                Create Account
              </Link>
            )}
          </div>

          <p className="text-sm text-blue-100 mt-4">
            {!authed && (
              <>
                Already have an account?{" "}
                <Link href="/shop/login" className="font-semibold text-white underline">
                  Sign in
                </Link>
                {" · "}
              </>
            )}
            Need help?{" "}
            <Link
              data-testid="b2c-hero-expert-help"
              href="/shop/support"
              className="font-semibold text-white underline"
            >
              Get Expert Help
            </Link>
          </p>

          {/* Stats */}
          <div
            data-testid="b2c-hero-stats"
            className="grid grid-cols-3 gap-4 md:gap-8 mt-12 pt-10 border-t border-white/20 max-w-xl"
          >
            <div>
              <p className="text-2xl md:text-3xl font-bold">50K+</p>
              <p className="text-blue-100 text-xs md:text-sm">Genuine Parts</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold">24-48h</p>
              <p className="text-blue-100 text-xs md:text-sm">Delivery</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold">100%</p>
              <p className="text-blue-100 text-xs md:text-sm">Authentic</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
