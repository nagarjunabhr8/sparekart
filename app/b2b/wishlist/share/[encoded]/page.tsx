import { mockProducts, PartProduct } from "@/lib/mockData";
import SharedWishlistClient from "./SharedWishlistClient";

interface SharedWishlistPageProps {
  params: Promise<{ encoded: string }>;
}

export default async function SharedWishlistPage({
  params,
}: SharedWishlistPageProps) {
  const { encoded } = await params;

  let products: PartProduct[] = [];
  try {
    const decoded = atob(encoded);
    const ids = decoded.split(",");
    products = mockProducts.filter((p) => ids.includes(p.id));
  } catch (error) {
    console.error("Failed to decode wishlist:", error);
  }

  return <SharedWishlistClient products={products} />;
}
