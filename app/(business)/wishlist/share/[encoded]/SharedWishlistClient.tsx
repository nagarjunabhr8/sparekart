"use client";

import { Star, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import StockBadge from "@/components/catalog/StockBadge";
import toast from "react-hot-toast";
import { PartProduct } from "@/lib/mockData";

interface SharedWishlistClientProps {
  products: PartProduct[];
}

export default function SharedWishlistClient({
  products,
}: SharedWishlistClientProps) {
  const { addItem: addToCart } = useCartStore();

  const handleAddToCart = (product: PartProduct) => {
    addToCart({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      mrp: product.originalPrice,
      quantity: 1,
      image: product.image,
      stock: product.stockCount,
      b2bTierDiscount: 15,
    });
    toast.success(`${product.name} added to cart`);
  };

  const handleAddAllToCart = () => {
    products.forEach((product) => {
      addToCart({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        mrp: product.originalPrice,
        quantity: 1,
        image: product.image,
        stock: product.stockCount,
        b2bTierDiscount: 15,
      });
    });
    toast.success(`All ${products.length} items added to cart`);
  };

  if (products.length === 0) {
    return (
      <div data-testid="shared-wishlist-empty" className="min-h-screen bg-slate-50 py-12">
        <div className="container-app text-center">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">
            Wishlist Not Found
          </h1>
          <p className="text-neutral-600 mb-6">
            This wishlist link is invalid or has expired.
          </p>
          <a
            href="/catalog"
            className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-900 transition-colors"
          >
            Browse Catalog
          </a>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="shared-wishlist-page" className="min-h-screen bg-slate-50 py-12">
      <div className="container-app">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              Shared Wishlist
            </h1>
            <p className="text-neutral-600 mt-1">{products.length} items</p>
          </div>
          {products.length > 0 && (
            <button
              onClick={handleAddAllToCart}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-900 transition-colors flex items-center gap-2"
            >
              <ShoppingCart size={16} />
              Add All to Cart
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="card border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="h-48 bg-slate-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-xs uppercase text-neutral-500 font-semibold mb-1">
                  {product.category}
                </p>
                <h3 className="font-bold text-neutral-900 text-sm mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-xs text-neutral-600 mb-3">
                  by <span className="font-semibold">{product.brand}</span>
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={`${
                          i < Math.floor(product.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-neutral-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-neutral-600">
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                {/* Stock */}
                <div className="mb-3">
                  <StockBadge
                    qty={product.stockCount}
                    expectedDate={
                      !product.inStock
                        ? new Date(
                            Date.now() + 5 * 24 * 60 * 60 * 1000
                          ).toISOString()
                        : undefined
                    }
                  />
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex gap-2 items-baseline">
                    <span className="text-2xl font-bold text-primary">
                      ₹{product.price}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-neutral-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                  className={`w-full py-2 rounded-lg font-semibold text-white transition-colors flex items-center justify-center gap-2 ${
                    product.inStock
                      ? "bg-primary hover:bg-blue-900"
                      : "bg-neutral-300 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart size={16} />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
