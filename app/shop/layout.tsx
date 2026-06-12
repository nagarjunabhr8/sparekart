"use client";

import { usePathname } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

// Auth routes render standalone (no navbar/footer).
const STANDALONE_ROUTES = ["/shop/login", "/shop/register"];

export default function B2CLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isStandalone = STANDALONE_ROUTES.some((route) =>
    pathname?.startsWith(route)
  );

  if (isStandalone) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation portal="b2c" />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
