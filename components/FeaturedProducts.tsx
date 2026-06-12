"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import AddToCartButton from "@/components/shop/AddToCartButton";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  authentic: boolean;
  seller: string;
}

const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Engine Oil Filter (Bosch)",
    category: "Oil Filters",
    price: 349,
    originalPrice: 499,
    image:
      "https://images.unsplash.com/photo-1486262715619-67b519e0edd0?w=300&h=300&fit=crop",
    rating: 4.8,
    reviews: 234,
    inStock: true,
    authentic: true,
    seller: "AutoPro Store",
  },
  {
    id: "2",
    name: "Air Intake Filter (Mann)",
    category: "Air Filters",
    price: 299,
    originalPrice: 449,
    image:
      "https://images.unsplash.com/photo-1486262715619-67b519e0edd0?w=300&h=300&fit=crop",
    rating: 4.7,
    reviews: 189,
    inStock: true,
    authentic: true,
    seller: "TrueParts India",
  },
  {
    id: "3",
    name: "Brake Pad Set (Brembo)",
    category: "Brakes",
    price: 1299,
    originalPrice: 1799,
    image:
      "https://images.unsplash.com/photo-1486262715619-67b519e0edd0?w=300&h=300&fit=crop",
    rating: 4.9,
    reviews: 456,
    inStock: true,
    authentic: true,
    seller: "Premium Auto Parts",
  },
  {
    id: "4",
    name: "Spark Plugs (NGK)",
    category: "Engine Parts",
    price: 599,
    originalPrice: 899,
    image:
      "https://images.unsplash.com/photo-1486262715619-67b519e0edd0?w=300&h=300&fit=crop",
    rating: 4.6,
    reviews: 312,
    inStock: true,
    authentic: true,
    seller: "OEM Supply Co",
  },
];

export default function FeaturedProducts() {
  return (
    <section data-testid="b2c-featured-products" className="bg-white py-12 md:py-16 border-b border-neutral-200">
      <div className="container-app">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">
              Trending This Week
            </h2>
            <p className="text-neutral-600">
              Popular choices from verified mechanics
            </p>
          </div>
          <Link
            data-testid="b2c-featured-view-all-link"
            href="/shop/products"
            className="text-primary font-semibold hover:text-orange-700 transition-colors hidden md:block"
          >
            View All →
          </Link>
        </div>

        <div data-testid="b2c-featured-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredProducts.map((product) => (
            <Link
              data-testid={`b2c-featured-product-${product.id}`}
              data-product-id={product.id}
              key={product.id}
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
                {product.authentic && (
                  <div className="absolute top-3 left-3 badge-authentic">
                    ✓ Authentic
                  </div>
                )}
                {product.originalPrice > product.price && (
                  <div className="absolute top-3 right-3 bg-warning text-white px-2 py-1 rounded text-xs font-semibold">
                    -
                    {Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100
                    )}
                    %
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

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={`${
                          i < Math.floor(product.rating)
                            ? "fill-accent text-accent"
                            : "text-neutral-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-neutral-600">
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                {/* Seller Info */}
                <p className="text-xs text-neutral-500 mb-3">
                  By <span className="font-semibold">{product.seller}</span>
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-lg font-bold text-primary">
                    ₹{product.price}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-neutral-400 line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>

                {/* Stock Status & Button */}
                <div className="space-y-2">
                  <p
                    className={`text-xs font-semibold ${
                      product.inStock
                        ? "text-success"
                        : "text-warning"
                    }`}
                  >
                    {product.inStock ? "✓ In Stock" : "Out of Stock"}
                  </p>
                  <AddToCartButton
                    testId={`b2c-featured-add-to-cart-${product.id}`}
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
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link href="/shop/products" className="btn-primary bg-primary hover:bg-orange-700">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
