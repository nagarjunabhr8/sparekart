import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function B2CLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation portal="b2c" />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
