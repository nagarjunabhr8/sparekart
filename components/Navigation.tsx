"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { useCartStore } from "@/stores/cartStore";
import { useCart } from "@/lib/cartContext";
import { useShopAuth } from "@/lib/shopAuthContext";
import CartDrawer from "./B2B/CartDrawer";
import ProfileDropdown from "./ProfileDropdown";
import ShopProfileDropdown from "./shop/ShopProfileDropdown";

interface NavigationProps {
  portal: "b2c" | "b2b";
}

export default function Navigation({ portal }: NavigationProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [animate, setAnimate] = useState(false);
  const { isAuthenticated } = useAuth();
  const { getItemCount } = useCartStore();
  const cartItems = mounted ? getItemCount() : 0;
  // Independent B2C cart (React Context) — separate from the B2B Zustand store.
  const { totalItems: b2cTotalItems } = useCart();
  const b2cCartItems = mounted ? b2cTotalItems : 0;
  // B2C customer auth — used to gate the My Orders nav link to signed-in users.
  const { isAuthenticated: shopAuthenticated } = useShopAuth();
  const showShopOrders = mounted && shopAuthenticated;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const count = portal === "b2c" ? b2cCartItems : cartItems;
    if (count > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 600);
      return () => clearTimeout(timer);
    }
  }, [cartItems, b2cCartItems, portal]);

  // Only treat user as authenticated after client-side mount to avoid hydration mismatch
  const showAuthLinks = mounted && isAuthenticated;

  const navLinks =
    portal === "b2c"
      ? [
          { href: "/shop", label: "Home" },
          { href: "/shop/products", label: "Browse Parts" },
          ...(showShopOrders
            ? [{ href: "/shop/orders", label: "My Orders" }]
            : []),
          { href: "/shop/support", label: "Support" },
        ]
      : [
          { href: "/", label: "Home" },
          ...(showAuthLinks
            ? [
                { href: "/catalog", label: "Catalog" },
                { href: "/orders", label: "Orders" },
                { href: "/account", label: "Account" },
              ]
            : []),
        ];

  return (
    <nav
      data-testid={`navbar-${portal}`}
      className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-sm"
    >
      <div className="container-app">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            data-testid="navbar-logo"
            href={portal === "b2c" ? "/shop" : "/"}
            className="flex items-center gap-3"
          >
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src="/images/logo.png"
                alt="SpareKart Logo"
                width={48}
                height={48}
                priority
                className="object-contain"
              />
            </div>
            <span className="font-bold text-lg text-neutral-900 hidden sm:inline">
              SpareKart
            </span>
            {portal === "b2b" && (
              <span className="text-xs bg-secondary text-white px-2 py-1 rounded">
                B2B
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div data-testid="navbar-links-desktop" className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/shop" && link.href !== "/" && pathname.startsWith(link.href));
              const slug = link.label.toLowerCase().replace(/\s+/g, "-");
              return (
                <Link
                  data-testid={`navlink-${slug}`}
                  key={link.href}
                  href={link.href}
                  className={`transition-colors font-medium text-sm ${
                    isActive
                      ? "text-primary border-b-2 border-primary pb-1"
                      : "text-neutral-600 hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {portal === "b2c" && (
              <Link
                data-testid="navbar-cart-link"
                href="/shop/cart"
                aria-label="Cart"
                className={`relative p-2 text-neutral-600 hover:text-primary transition-colors ${
                  animate ? "animate-bounce" : ""
                }`}
              >
                <ShoppingCart size={20} />
                {b2cCartItems > 0 && (
                  <span
                    data-testid="navbar-cart-count"
                    className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] leading-none rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center font-bold ring-2 ring-white"
                  >
                    {b2cCartItems}
                  </span>
                )}
              </Link>
            )}

            {portal === "b2c" && <ShopProfileDropdown />}

            {portal === "b2b" && (
              <>
                <button
                  data-testid="navbar-cart-button"
                  onClick={() => setCartDrawerOpen(true)}
                  className={`relative p-2 text-neutral-600 hover:text-primary transition-colors ${
                    animate ? "animate-bounce" : ""
                  }`}
                >
                  <ShoppingCart size={20} />
                  {cartItems > 0 && (
                    <span
                      data-testid="navbar-cart-count"
                      className={`absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold transition-transform ${
                        animate ? "scale-125" : "scale-100"
                      }`}
                    >
                      {cartItems}
                    </span>
                  )}
                </button>
                <ProfileDropdown />
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              data-testid="navbar-mobile-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2"
            >
              {isOpen ? (
                <X size={20} className="text-neutral-600" />
              ) : (
                <Menu size={20} className="text-neutral-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mounted && isOpen && (
          <div
            data-testid="navbar-links-mobile"
            className="md:hidden border-t border-neutral-200 py-4 space-y-3"
          >
            {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/shop" && link.href !== "/" && pathname.startsWith(link.href));
                const slug = link.label.toLowerCase().replace(/\s+/g, "-");
                return (
                  <Link
                    data-testid={`navlink-mobile-${slug}`}
                    key={link.href}
                    href={link.href}
                    className={`block font-medium py-2 pl-3 border-l-4 transition-colors ${
                      isActive
                        ? "text-primary border-primary"
                        : "text-neutral-600 border-transparent hover:text-primary"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
          </div>
        )}
      </div>

      {/* Cart Drawer - Only for B2B Portal */}
      {portal === "b2b" && (
        <CartDrawer
          isOpen={cartDrawerOpen}
          onClose={() => setCartDrawerOpen(false)}
          userPlan="Professional"
        />
      )}
    </nav>
  );
}
