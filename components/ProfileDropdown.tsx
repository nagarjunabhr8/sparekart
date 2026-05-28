"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Heart, LogOut, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { useWishlistStore } from "@/stores/wishlistStore";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const wishlistCount = useWishlistStore((state) => state.getCount());

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

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push("/b2b/login");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-neutral-600 hover:text-primary transition-colors relative"
        title={isAuthenticated ? user?.companyName : "Account"}
        aria-label="Account menu"
      >
        <User size={20} />
        {wishlistCount > 0 && isAuthenticated && (
          <span className="absolute top-0 right-0 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
            {wishlistCount > 9 ? "9+" : wishlistCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
          {isAuthenticated ? (
            <>
              <div className="p-4 border-b border-slate-200">
                <p className="text-sm font-semibold text-neutral-900">
                  {user?.companyName}
                </p>
                <p className="text-xs text-neutral-600">{user?.email}</p>
              </div>

              <nav className="divide-y divide-slate-200">
                <button
                  onClick={() => {
                    router.push("/b2b/account");
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-medium text-neutral-700 hover:bg-slate-50 transition-colors"
                >
                  Account Settings
                </button>
                <button
                  onClick={() => {
                    router.push("/b2b/account/wishlist");
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-medium text-neutral-700 hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Heart size={16} />
                    My Wishlist
                  </span>
                  {wishlistCount > 0 && (
                    <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </button>
              </nav>

              <div className="p-3 border-t border-slate-200">
                <button
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
              <div className="px-4 py-3 border-b border-slate-200">
                <p className="text-sm font-semibold text-neutral-900">Account</p>
                <p className="text-xs text-neutral-600">
                  Sign in or create a business account
                </p>
              </div>
              <div className="p-3 space-y-2">
                <button
                  onClick={() => {
                    router.push("/b2b/login");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white hover:bg-blue-900 rounded-lg transition-colors font-medium text-sm"
                >
                  <LogIn size={16} />
                  Login
                </button>
                <button
                  onClick={() => {
                    router.push("/b2b/register");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-colors font-medium text-sm"
                >
                  <UserPlus size={16} />
                  Register
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
