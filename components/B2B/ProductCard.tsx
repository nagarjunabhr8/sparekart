"use client";

import { useState } from "react";
import { PartProduct } from "@/lib/mockData";
import { Star, ShoppingCart, Bell, Heart } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import toast from "react-hot-toast";
import StockBadge from "@/components/catalog/StockBadge";
import StockNotifyModal from "@/components/catalog/StockNotifyModal";

interface ProductCardProps {
  product: PartProduct;
  view?: "grid" | "list";
}

export default function ProductCard({ product, view = "grid" }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const { addItem } = useCartStore();
  const { toggleItem, isWishlisted } = useWishlistStore();
  const isInWishlist = isWishlisted(product.id);

  const handleToggleWishlist = () => {
    toggleItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      inStock: product.inStock,
      stockCount: product.stockCount,
      compatibility: product.compatibility,
      rating: product.rating,
      reviews: product.reviews,
      discount: product.discount,
      genuine: product.genuine,
      savedPrice: product.price,
      addedAt: new Date().toISOString(),
    });
    toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      addItem({
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
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error("Failed to add item to cart");
    } finally {
      setIsAdding(false);
    }
  };
  if (view === "list") {
    return (
      <div className="card p-4 md:p-6 border border-slate-200 hover:shadow-lg transition-shadow flex gap-4">
        {/* Image */}
        <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 bg-slate-100 rounded-lg overflow-hidden relative group">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {/* Wishlist Heart for List View */}
          <button
            onClick={(e) => {
              e.preventDefault();
              handleToggleWishlist();
            }}
            className="absolute top-1 right-1 p-1 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
            title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              size={14}
              className={
                isInWishlist
                  ? "fill-orange-500 text-orange-500"
                  : "text-neutral-400 hover:text-orange-400"
              }
            />
          </button>
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase text-neutral-500 font-semibold mb-1">
              {product.category}
            </p>
            <h3 className="font-bold text-neutral-900 text-lg mb-1">
              {product.name}
            </h3>
            <p className="text-sm text-neutral-600 mb-3">
              Brand: <span className="font-semibold">{product.brand}</span>
            </p>

            {/* Compatibility */}
            <p className="text-xs text-neutral-600 mb-3">
              Compatible with: {product.compatibility}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={`${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-neutral-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-neutral-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
            <div className="space-y-1">
              <div className="flex gap-2 items-baseline">
                <span className="text-2xl font-bold text-primary">₹{product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-neutral-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>
              <div className="flex gap-2 items-center flex-wrap">
                <StockBadge
                  qty={product.stockCount}
                  expectedDate={product.inStock ? undefined : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()}
                />
                {!product.inStock && (
                  <button
                    onClick={() => setShowNotifyModal(true)}
                    className="text-xs font-medium text-primary hover:text-blue-900 flex items-center gap-1 px-2 py-1 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Bell size={14} />
                    Notify Me
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || isAdding}
              className={`py-2 px-4 rounded-lg font-semibold text-white transition-colors flex items-center gap-2 ${
                product.inStock
                  ? "bg-primary hover:bg-blue-900 disabled:opacity-50"
                  : "bg-neutral-300 cursor-not-allowed"
              }`}
            >
              <ShoppingCart size={16} />
              <span className="hidden sm:inline">{isAdding ? "Adding..." : "Add"}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden border border-slate-200 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-48 bg-slate-100 overflow-hidden group">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Wishlist Heart Icon */}
        <button
          onClick={(e) => {
            e.preventDefault();
            handleToggleWishlist();
          }}
          className="absolute top-2 right-2 z-10 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
          title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={16}
            className={
              isInWishlist
                ? "fill-orange-500 text-orange-500"
                : "text-neutral-400 hover:text-orange-400"
            }
          />
        </button>
        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex gap-2 flex-wrap">
          {product.discount > 0 && (
            <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
              -{product.discount}%
            </div>
          )}
          {product.genuine && (
            <div className="bg-emerald-600 text-white px-2 py-1 rounded text-xs font-bold">
              ✓ Genuine
            </div>
          )}
        </div>
        {/* Stock Badge */}
        <div className="absolute bottom-0 right-0 bg-primary text-white px-2 py-1 rounded-tl text-xs font-bold">
          B2B -15%
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs uppercase text-neutral-500 font-semibold mb-2">
          {product.category}
        </p>

        <h3 className="font-bold text-neutral-900 text-sm mb-2 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-xs text-neutral-600 mb-2">
          by <span className="font-semibold">{product.brand}</span>
        </p>

        {/* Compatibility */}
        <p className="text-xs text-neutral-600 mb-3">
          {product.compatibility}
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

        {/* Stock Status */}
        <div className="mb-3">
          <StockBadge
            qty={product.stockCount}
            expectedDate={product.inStock ? undefined : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()}
          />
        </div>

        {/* Notify Me Button for OOS */}
        {!product.inStock && (
          <button
            onClick={() => setShowNotifyModal(true)}
            className="w-full py-2 mb-3 bg-slate-100 hover:bg-slate-200 text-neutral-700 font-medium rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
          >
            <Bell size={16} />
            Notify Me
          </button>
        )}

        {/* Price */}
        <div className="mb-4">
          <div className="flex gap-2 items-baseline">
            <span className="text-2xl font-bold text-primary">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-neutral-400 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || isAdding}
          className={`w-full py-2 rounded-lg font-semibold text-white transition-colors flex items-center justify-center gap-2 mt-auto ${
            product.inStock
              ? "bg-primary hover:bg-blue-900 disabled:opacity-50"
              : "bg-neutral-300 cursor-not-allowed"
          }`}
        >
          <ShoppingCart size={16} />
          {isAdding ? "Adding..." : "Add to Cart"}
        </button>
      </div>

      {/* Stock Notify Modal */}
      <StockNotifyModal
        isOpen={showNotifyModal}
        onClose={() => setShowNotifyModal(false)}
        partId={product.id}
        partName={product.name}
      />
    </div>
  );
}
