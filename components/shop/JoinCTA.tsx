"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { UserPlus, LogIn, Package, User, ShoppingBag } from "lucide-react";
import { useShopAuth } from "@/lib/shopAuthContext";

export default function JoinCTA() {
  const { user, hydrated, isAuthenticated } = useShopAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const authed = mounted && hydrated && isAuthenticated;
  const firstName = user?.name?.split(" ")[0];

  return (
    <section
      data-testid="b2c-join-cta"
      className="bg-white py-12 md:py-16 border-b border-neutral-200"
    >
      <div className="container-app">
        <div className="rounded-2xl p-8 md:p-12 text-center bg-gradient-to-br from-secondary to-blue-800 text-white">
          {authed ? (
            <>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Welcome back, {firstName}!
              </h2>
              <p className="text-blue-100 mb-6">
                Pick up where you left off.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/shop/products"
                  className="btn-primary bg-primary hover:bg-orange-700 inline-flex items-center gap-2"
                >
                  <ShoppingBag size={18} /> Browse Parts
                </Link>
                <Link
                  href="/shop/orders"
                  className="btn-outline border-white text-white hover:bg-white/10 inline-flex items-center gap-2"
                >
                  <Package size={18} /> My Orders
                </Link>
                <Link
                  href="/shop/profile"
                  className="btn-outline border-white text-white hover:bg-white/10 inline-flex items-center gap-2"
                >
                  <User size={18} /> My Account
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                New to SpareKart?
              </h2>
              <p className="text-blue-100 mb-6 max-w-xl mx-auto">
                Create a free account to track orders, save your addresses &amp;
                vehicles, and check out faster. Browsing is always open — no login
                required.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  data-testid="b2c-join-register"
                  href="/shop/register"
                  className="btn-primary bg-primary hover:bg-orange-700 inline-flex items-center gap-2"
                >
                  <UserPlus size={18} /> Create Account
                </Link>
                <Link
                  data-testid="b2c-join-login"
                  href="/shop/login"
                  className="btn-outline border-white text-white hover:bg-white/10 inline-flex items-center gap-2"
                >
                  <LogIn size={18} /> Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
