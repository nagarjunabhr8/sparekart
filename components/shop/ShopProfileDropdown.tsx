"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Package, LogOut, LogIn } from "lucide-react";
import { useShopAuth } from "@/lib/shopAuthContext";

export default function ShopProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, isAuthenticated, logout } = useShopAuth();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Before hydration, render a neutral account icon to avoid SSR mismatch.
  const showAuthed = mounted && isAuthenticated;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push("/shop");
  };

  return (
    <div data-testid="shop-profile-dropdown" className="relative" ref={dropdownRef}>
      <button
        data-testid="shop-profile-toggle"
        onClick={() => setIsOpen((o) => !o)}
        className="p-2 text-neutral-600 hover:text-primary transition-colors"
        title={showAuthed ? user?.name : "Account"}
        aria-label="Account menu"
      >
        <User size={20} />
      </button>

      {isOpen && (
        <div
          data-testid="shop-profile-menu"
          className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-lg shadow-lg z-50"
        >
          {showAuthed ? (
            <>
              <div className="p-4 border-b border-neutral-200">
                <p data-testid="shop-profile-name" className="text-sm font-semibold text-neutral-900">
                  {user?.name}
                </p>
                {user?.email && (
                  <p className="text-xs text-neutral-600">{user.email}</p>
                )}
                {!user?.email && user?.phone && (
                  <p className="text-xs text-neutral-600">+91 {user.phone}</p>
                )}
              </div>

              <nav className="py-1">
                <Link
                  data-testid="shop-profile-orders"
                  href="/shop/orders"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  <Package size={16} />
                  My Orders
                </Link>
              </nav>

              <div className="p-3 border-t border-neutral-200">
                <button
                  data-testid="shop-profile-logout"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition-colors font-medium text-sm"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-neutral-200">
                <p className="text-sm font-semibold text-neutral-900">Account</p>
                <p className="text-xs text-neutral-600">
                  Sign in to track orders & checkout faster
                </p>
              </div>
              <div className="p-3 space-y-2">
                <Link
                  data-testid="shop-profile-login"
                  href="/shop/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#EA580C] text-white hover:bg-orange-700 rounded-lg transition-colors font-medium text-sm"
                >
                  <LogIn size={16} />
                  Sign In
                </Link>
                <Link
                  data-testid="shop-profile-register"
                  href="/shop/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-[#EA580C] text-[#EA580C] hover:bg-orange-50 rounded-lg transition-colors font-medium text-sm"
                >
                  Create Account
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
