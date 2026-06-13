import Link from "next/link";
import { shopProducts, getShopProductById } from "@/lib/shopProducts";
import ProductDetailClient from "@/components/shop/ProductDetailClient";

// Pre-render detail pages for the 20 catalog products.
export function generateStaticParams() {
  return Array.from({ length: 20 }, (_, i) => ({ id: String(i + 1) }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getShopProductById(id);

  if (!product) {
    return (
      <div className="container-app py-16 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          Product not found
        </h1>
        <p className="text-neutral-600 mb-6">
          This part may no longer be available.
        </p>
        <Link
          href="/shop/products"
          className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-orange-700"
        >
          Browse Parts
        </Link>
      </div>
    );
  }

  // Related: same category first, then fill up to 4 with others.
  const sameCategory = shopProducts.filter(
    (p) => p.category === product.category && p.id !== product.id
  );
  const others = shopProducts.filter(
    (p) => p.category !== product.category && p.id !== product.id
  );
  const related = [...sameCategory, ...others].slice(0, 4);

  return <ProductDetailClient product={product} related={related} />;
}
