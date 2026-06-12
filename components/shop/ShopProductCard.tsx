"use client";

import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import type { PartProduct } from "@/lib/mockData";

export default function ShopProductCard({ product }: { product: PartProduct }) {
  const discountPct =
    product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : 0;

  return (
    <Link
      data-testid={`shop-product-${product.id}`}
      data-product-id={product.id}
      href={`/shop/products/${product.id}`}
      className="card overflow-hidden hover:shadow-lg transition-all duration-300 group"
    >
      {/* Product Image */}
      <div className="relative h-48 bg-neutral-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.genuine && (
          <div className="absolute top-3 left-3 badge-authentic">✓ Authentic</div>
        )}
        {discountPct > 0 && (
          <div className="absolute top-3 right-3 bg-warning text-white px-2 py-1 rounded text-xs font-semibold">
            -{discountPct}%
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4">
        <p className="text-xs text-neutral-500 uppercase tracking-wide mb-2">
          {product.category}
        </p>
        <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Compatibility */}
        <p className="text-xs text-neutral-500 mb-3 line-clamp-1">
          Fits: <span className="font-medium">{product.compatibility}</span>
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
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

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-lg font-bold text-primary">₹{product.price}</span>
          {discountPct > 0 && (
            <span className="text-sm text-neutral-400 line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        {/* Stock Status & Button */}
        <div className="space-y-2">
          <p
            className={`text-xs font-semibold ${
              product.inStock ? "text-success" : "text-warning"
            }`}
          >
            {product.inStock ? "✓ In Stock" : "Out of Stock"}
          </p>
          <button
            data-testid={`shop-product-add-to-cart-${product.id}`}
            className="w-full btn-primary bg-primary hover:bg-orange-700 text-sm flex items-center justify-center gap-2 py-2"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}
