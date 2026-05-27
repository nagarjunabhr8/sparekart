"use client";

import { useState } from "react";
import { Heart, ShoppingCart, AlertCircle, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useCartStore } from "@/stores/cartStore";

interface PartCardProps {
  id: string;
  name: string;
  brand: string;
  image?: string;
  mrp: number;
  b2bPrice: number;
  discount: number;
  genuine: boolean;
  stock: {
    quantity: number;
    status: "in-stock" | "low-stock" | "out-of-stock";
    expectedDate?: string;
  };
  compatibility: {
    models: string[];
    years: string;
  };
  b2bTierDiscount: number;
  onNotifyMe?: (id: string) => void;
}

export default function PartCard({
  id,
  name,
  brand,
  image,
  mrp,
  b2bPrice,
  discount,
  genuine,
  stock,
  compatibility,
  b2bTierDiscount,
  onNotifyMe,
}: PartCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [cartQty, setCartQty] = useState(0);
  const { addItem, updateQty } = useCartStore();

  const compatibilityText = `Fits: ${compatibility.models.join(", ")} (${compatibility.years})`;

  const handleAddToCart = () => {
    if (stock.status === "out-of-stock") {
      onNotifyMe?.(id);
      return;
    }

    if (cartQty === 0) {
      // First click - add 1 unit
      const cartItem = {
        id,
        name,
        brand,
        image,
        price: b2bPrice,
        mrp,
        quantity: 1,
        stock: stock.quantity,
        b2bTierDiscount,
      };
      addItem(cartItem);
      setCartQty(1);
      setIsAdded(true);

      // Show success toast
      toast.success(`${name} added to cart`, {
        duration: 3000,
        icon: "✓",
      });

      // Reset button after 1.5s
      setTimeout(() => {
        setIsAdded(false);
      }, 1500);
    }
  };

  const handleQtyChange = (newQty: number) => {
    if (newQty === 0) {
      // Remove from cart
      toast("Item removed from cart", { icon: "🗑️" });
      setCartQty(0);
    } else if (newQty > stock.quantity) {
      toast.error(`Only ${stock.quantity} units available`);
    } else {
      updateQty(id, newQty);
      setCartQty(newQty);
    }
  };

  return (
    <Link href={`/b2b/catalog/${id}`}>
      <div className="relative bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full flex flex-col hover:border-slate-300">
        {/* Image Container */}
        <div className="relative bg-slate-100 aspect-square flex items-center justify-center overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="text-6xl">⚙️</div>
          )}

          {/* Top-left: Authenticity Badge */}
          <div className="absolute top-3 left-3">
            <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm ${
              genuine
                ? "bg-green-100 text-green-700"
                : "bg-slate-200 text-slate-700"
            }`}>
              ✓ {genuine ? "Genuine" : "OEM Compatible"}
            </div>
          </div>

          {/* Top-right: Discount Badge & Wishlist */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {discount > 0 && (
              <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
                -{discount}%
              </div>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsWishlisted(!isWishlisted);
              }}
              className="bg-white rounded-full p-2 hover:bg-slate-100 transition-colors shadow-md"
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                size={18}
                className={isWishlisted ? "fill-red-500 text-red-500" : "text-slate-400"}
              />
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Brand */}
          <p className="text-xs text-neutral-500 uppercase tracking-wide font-medium mb-1">
            {brand}
          </p>

          {/* Part Name */}
          <h3 className="font-semibold text-neutral-900 line-clamp-2 mb-2 text-sm">
            {name}
          </h3>

          {/* Compatibility */}
          <div className="flex items-start gap-2 mb-3">
            <svg
              className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm11 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
            </svg>
            <p className="text-xs text-slate-600 leading-snug">{compatibilityText}</p>
          </div>

          {/* Stock Status */}
          <div className="mb-3">
            {stock.status === "in-stock" && (
              <p className="text-xs font-medium text-green-700">
                ✓ In Stock ({stock.quantity} units)
              </p>
            )}
            {stock.status === "low-stock" && (
              <p className="text-xs font-medium text-amber-700 flex items-center gap-1">
                <AlertCircle size={14} className="flex-shrink-0" />
                Low Stock ({stock.quantity} left)
              </p>
            )}
            {stock.status === "out-of-stock" && (
              <p className="text-xs font-medium text-red-700 flex items-center gap-1">
                <Calendar size={14} className="flex-shrink-0" />
                Expected: {stock.expectedDate}
              </p>
            )}
          </div>

          {/* Price Row */}
          <div className="mb-4 space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-red-700">₹{b2bPrice.toLocaleString("en-IN")}</span>
              <span className="text-sm text-neutral-500 line-through">₹{mrp.toLocaleString("en-IN")}</span>
              {discount > 0 && (
                <span className="text-xs font-semibold text-green-700">
                  {discount}% off
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded font-semibold">
                -{b2bTierDiscount}% B2B Discount
              </span>
            </div>
          </div>

          {/* Button - Add to Cart, Added, or Qty Stepper */}
          {stock.status === "out-of-stock" ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onNotifyMe?.(id);
              }}
              className="w-full py-2.5 rounded-lg font-semibold bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
            >
              Out of Stock
            </button>
          ) : isAdded ? (
            <div className="w-full py-2.5 rounded-lg font-semibold bg-green-100 text-green-700 flex items-center justify-center gap-2 animate-pulse">
              <span>✓</span>
              Added to Cart
            </div>
          ) : cartQty === 0 ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToCart();
              }}
              className="w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors bg-neutral-900 text-white hover:bg-orange-500"
            >
              <ShoppingCart size={16} />
              Add to Cart
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-lg">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleQtyChange(cartQty - 1);
                }}
                className="flex-1 py-1 hover:bg-slate-200 rounded transition-colors font-semibold"
              >
                −
              </button>
              <span className="flex-1 text-center font-bold">{cartQty}</span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (cartQty < stock.quantity) {
                    handleQtyChange(cartQty + 1);
                  }
                }}
                className="flex-1 py-1 hover:bg-slate-200 rounded transition-colors font-semibold disabled:opacity-50"
                disabled={cartQty >= stock.quantity}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
