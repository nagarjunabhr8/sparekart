"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Building2,
  MapPin,
  Users,
  CreditCard,
  History,
  Bell,
  Lock,
  LogOut,
  Heart,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";

const accountTabs = [
  { href: "/b2b/account", label: "Business Profile", icon: Building2 },
  { href: "/b2b/account/addresses", label: "Delivery Addresses", icon: MapPin },
  { href: "/b2b/account/team", label: "Team Members", icon: Users },
  { href: "/b2b/account/payment", label: "Payment Methods", icon: CreditCard },
  { href: "/b2b/account/history", label: "Order History", icon: History },
  { href: "/b2b/account/wishlist", label: "My Wishlist", icon: Heart },
  { href: "/b2b/account/notifications", label: "Notifications", icon: Bell },
  { href: "/b2b/account/security", label: "Security", icon: Lock },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.push("/b2b/login");
    }
  }, [isAuthenticated, router]);

  if (!mounted || !isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/b2b/login");
  };

  return (
    <div data-testid="account-layout" className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container-app py-6">
          <h1 className="text-3xl font-bold text-neutral-900">Account Settings</h1>
          <p data-testid="account-company-name" className="text-neutral-600 text-sm mt-1">{user?.companyName}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-app py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div data-testid="account-sidebar" className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden sticky top-20">
              <nav data-testid="account-nav" className="divide-y divide-slate-200">
                {accountTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive =
                    pathname === tab.href ||
                    (tab.href !== "/b2b/account" &&
                      pathname.startsWith(tab.href));

                  const slug = tab.href.split("/").pop() || "profile";
                  return (
                    <button
                      data-testid={`account-nav-${slug}`}
                      key={tab.href}
                      onClick={() => router.push(tab.href)}
                      className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-colors ${
                        isActive
                          ? "bg-primary bg-opacity-10 text-primary border-l-4 border-primary"
                          : "text-neutral-700 hover:bg-slate-50 border-l-4 border-transparent"
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium text-sm">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Logout Button */}
              <div className="p-4 border-t border-slate-200">
                <button
                  data-testid="account-logout-button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition-colors font-medium text-sm"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div data-testid="account-content" className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
