import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpareKart - Genuine Automobile Spare Parts",
  description:
    "Find authentic spare parts for your vehicle. Trusted by mechanics and vehicle owners across India.",
  icons: {
    icon: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-neutral-50">{children}</body>
    </html>
  );
}
