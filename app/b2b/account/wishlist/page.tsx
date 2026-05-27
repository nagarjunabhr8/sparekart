"use client";

import { useWishlistStore } from "@/stores/wishlistStore";
import { useCartStore } from "@/stores/cartStore";
import { Heart, Trash2, Share2, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import StockBadge from "@/components/catalog/StockBadge";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  const handleRemove = (id: string) => {
    removeItem(id);
    toast.success("Removed from wishlist");
  };

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      brand: item.brand,
      price: item.price,
      mrp: item.originalPrice,
      quantity: 1,
      image: item.image,
      stock: item.stockCount,
      b2bTierDiscount: 15,
    });
    toast.success(`${item.name} added to cart`);
  };

  const handleAddAllToCart = () => {
    items.forEach((item) => {
      addToCart({
        id: item.id,
        name: item.name,
        brand: item.brand,
        price: item.price,
        mrp: item.originalPrice,
        quantity: 1,
        image: item.image,
        stock: item.stockCount,
        b2bTierDiscount: 15,
      });
    });
    toast.success(`All ${items.length} items added to cart`);
  };

  const handleShareWishlist = () => {
    const wishlistUrl = `${window.location.origin}/b2b/wishlist/share/${btoa(items.map((i) => i.id).join(","))}`;
    navigator.clipboard.writeText(wishlistUrl);
    toast.success("Wishlist link copied to clipboard");
  };

  const getPriceDropStatus = (item: any) => {
    return item.price < item.savedPrice;
  };

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">My Wishlist</h1>
            <p className="text-neutral-600 mt-1">0 items saved</p>
          </div>
        </div>

        <div className="card p-12 border border-slate-200 rounded-lg text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
            <Heart size={28} className="text-neutral-400" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mb-2">No Saved Items</h2>
          <p className="text-neutral-600 mb-6">
            Start adding parts to your wishlist by clicking the heart icon on product cards
          </p>
          <a
            href="/b2b/catalog"
            className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-900 transition-colors"
          >
            Browse Catalog
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">My Wishlist</h1>
          <p className="text-neutral-600 mt-1">{items.length} items saved</p>
        </div>
        <div className="flex gap-2">
          {items.length > 0 && (
            <>
              <button
                onClick={handleAddAllToCart}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-900 transition-colors flex items-center gap-2"
              >
                <ShoppingCart size={16} />
                Add All to Cart
              </button>
              <button
                onClick={handleShareWishlist}
                className="px-4 py-2 border border-slate-300 text-neutral-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <Share2 size={16} />
                Share
              </button>
            </>
          )}
        </div>
      </div>

      {/* Price Drop Alert */}
      {items.some((item) => getPriceDropStatus(item)) && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-green-900">Price Drop Alert! 🎉</h3>
              <p className="text-sm text-green-800 mt-1">
                {items.filter((item) => getPriceDropStatus(item)).length} item(s) have dropped in price
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const isDropped = getPriceDropStatus(item);
          const savingsPercent = Math.round(
            ((item.savedPrice - item.price) / item.savedPrice) * 100
          );

          return (
            <div
              key={item.id}
              className="card border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative h-48 bg-slate-100 overflow-hidden group">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                {isDropped && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                    ↓ {savingsPercent}% Off
                  </div>
                )}
                <button
                  onClick={() => handleRemove(item.id)}
                  className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-red-50 transition-colors"
                  title="Remove from wishlist"
                >
                  <Heart
                    size={16}
                    className="fill-orange-500 text-orange-500"
                  />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-xs uppercase text-neutral-500 font-semibold mb-1">
                  {item.category}
                </p>
                <h3 className="font-bold text-neutral-900 text-sm mb-2 line-clamp-2">
                  {item.name}
                </h3>
                <p className="text-xs text-neutral-600 mb-3">
                  by <span className="font-semibold">{item.brand}</span>
                </p>

                {/* Price */}
                <div className="mb-3">
                  <div className="flex gap-2 items-baseline mb-1">
                    <span className="text-xl font-bold text-primary">
                      ₹{item.price}
                    </span>
                    {item.originalPrice > item.price && (
                      <span className="text-sm text-neutral-400 line-through">
                        ₹{item.originalPrice}
                      </span>
                    )}
                  </div>
                  {isDropped && (
                    <p className="text-xs text-green-600 font-semibold">
                      Saved: ₹{(item.savedPrice - item.price).toFixed(0)}
                    </p>
                  )}
                </div>

                {/* Stock */}
                <div className="mb-4">
                  <StockBadge
                    qty={item.stockCount}
                    expectedDate={
                      !item.inStock
                        ? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
                        : undefined
                    }
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-blue-900 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <ShoppingCart size={14} />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="p-2 border border-slate-300 text-neutral-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
