"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { discountPct, type ShopProduct } from "@/lib/shopProducts";
import AddToCartButton from "@/components/shop/AddToCartButton";

export default function BrowseProductCard({ product }: { product: ShopProduct }) {
  const discount = discountPct(product);

  return (
    <Link
      data-testid={`shop-product-${product.id}`}
      data-product-id={product.id}
      href={`/shop/products/${product.id}`}
      className="card overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col"
    >
      {/* Image */}
      <div className="relative h-44 bg-neutral-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 badge-authentic">✓ Authentic</div>
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-warning text-white px-2 py-1 rounded text-xs font-semibold">
            -{discount}%
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
          {product.category}
        </p>
        <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.floor(product.rating)
                    ? "fill-accent text-accent"
                    : "text-neutral-300"
                }
              />
            ))}
          </div>
          <span className="text-xs text-neutral-600">
            {product.rating} ({product.reviews})
          </span>
        </div>

        <p className="text-xs text-neutral-500 mb-3">
          By <span className="font-semibold">{product.seller}</span>
        </p>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-bold text-primary">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {discount > 0 && (
            <span className="text-sm text-neutral-400 line-through">
              ₹{product.mrp.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        <p
          className={`text-xs font-semibold mb-2 ${
            product.inStock ? "text-success" : "text-warning"
          }`}
        >
          {product.inStock ? "✓ In Stock" : "Out of Stock"}
        </p>

        <div className="mt-auto">
          <AddToCartButton
            testId={`shop-product-add-to-cart-${product.id}`}
            disabled={!product.inStock}
            item={{
              productId: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              seller: product.seller,
              category: product.category,
            }}
          />
        </div>
      </div>
    </Link>
  );
}
