"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { useCartStore } from "@/stores/cartStore";
import CartDrawer from "./B2B/CartDrawer";
import ProfileDropdown from "./ProfileDropdown";

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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (cartItems > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 600);
      return () => clearTimeout(timer);
    }
  }, [cartItems]);

  const navLinks =
    portal === "b2c"
      ? [
          { href: "/b2c", label: "Home" },
          { href: "/b2c/products", label: "Browse Parts" },
          { href: "/b2c/orders", label: "My Orders" },
          { href: "/b2c/support", label: "Support" },
        ]
      : [
          { href: "/b2b", label: "Home" },
          { href: "/b2b/catalog", label: "Catalog" },
          { href: "/b2b/orders", label: "Orders" },
          { href: isAuthenticated ? "/b2b/account" : "/b2b/login", label: "Account" },
        ];

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-sm">
      <div className="container-app">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href={portal === "b2c" ? "/b2c" : "/b2b"} className="flex items-center gap-3">
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
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/b2c" && link.href !== "/b2b" && pathname.startsWith(link.href));
              return (
                <Link
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
          <div className="flex items-center gap-4">
            {portal === "b2b" && (
              <>
                <button
                  onClick={() => setCartDrawerOpen(true)}
                  className={`relative p-2 text-neutral-600 hover:text-primary transition-colors ${
                    animate ? "animate-bounce" : ""
                  }`}
                >
                  <ShoppingCart size={20} />
                  {cartItems > 0 && (
                    <span
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
          <div className="md:hidden border-t border-neutral-200 py-4 space-y-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/b2c" && link.href !== "/b2b" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block font-medium py-2 transition-colors ${
                    isActive
                      ? "text-primary border-l-4 border-primary pl-3"
                      : "text-neutral-600 hover:text-primary"
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
