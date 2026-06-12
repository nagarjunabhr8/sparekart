"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cartContext";

export default function ShopCartPage() {
  const { items, totalItems, totalPrice, updateQty, removeItem, clearCart } =
    useCart();

  if (items.length === 0) {
    return (
      <div
        data-testid="shop-cart-empty"
        className="container-app py-20 text-center"
      >
        <div className="flex justify-center mb-4 text-neutral-300">
          <ShoppingCart size={64} />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          Your cart is empty
        </h1>
        <p className="text-neutral-600 mb-6">
          Browse genuine parts and add them to your cart.
        </p>
        <Link
          href="/shop/products"
          className="inline-block btn-primary bg-primary hover:bg-orange-700 px-6 py-2"
        >
          Browse Parts
        </Link>
      </div>
    );
  }

  return (
    <div data-testid="shop-cart-page" className="container-app py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
          Your Cart{" "}
          <span className="text-neutral-500 text-lg font-normal">
            ({totalItems} item{totalItems === 1 ? "" : "s"})
          </span>
        </h1>
        <button
          data-testid="shop-cart-clear"
          onClick={clearCart}
          className="text-sm text-neutral-500 hover:text-warning transition-colors"
        >
          Clear cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              data-testid={`shop-cart-item-${item.productId}`}
              className="card p-4 flex gap-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-lg object-cover bg-neutral-100 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-neutral-500 uppercase tracking-wide">
                  {item.category}
                </p>
                <h3 className="font-semibold text-neutral-900 line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-xs text-neutral-500 mb-2">
                  By <span className="font-semibold">{item.seller}</span>
                </p>

                <div className="flex items-center justify-between">
                  {/* Qty controls */}
                  <div className="flex items-center border border-neutral-300 rounded-lg">
                    <button
                      data-testid={`shop-cart-decrement-${item.productId}`}
                      onClick={() => updateQty(item.productId, item.qty - 1)}
                      className="p-2 text-neutral-600 hover:text-primary"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span
                      data-testid={`shop-cart-qty-${item.productId}`}
                      className="px-3 text-sm font-semibold"
                    >
                      {item.qty}
                    </span>
                    <button
                      data-testid={`shop-cart-increment-${item.productId}`}
                      onClick={() => updateQty(item.productId, item.qty + 1)}
                      className="p-2 text-neutral-600 hover:text-primary"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-bold text-primary">
                      ₹{item.price * item.qty}
                    </span>
                    <button
                      data-testid={`shop-cart-remove-${item.productId}`}
                      onClick={() => removeItem(item.productId)}
                      className="text-neutral-400 hover:text-warning transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-bold text-lg text-neutral-900 mb-4">
              Order Summary
            </h2>
            <div className="flex justify-between text-sm text-neutral-600 mb-2">
              <span>Items ({totalItems})</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="flex justify-between text-sm text-neutral-600 mb-4">
              <span>Delivery</span>
              <span className="text-success font-semibold">FREE</span>
            </div>
            <div className="flex justify-between font-bold text-neutral-900 border-t border-neutral-200 pt-4 mb-6">
              <span>Total</span>
              <span data-testid="shop-cart-total">₹{totalPrice}</span>
            </div>
            <button
              data-testid="shop-cart-checkout"
              className="w-full btn-primary bg-primary hover:bg-orange-700 py-3"
            >
              Proceed to Checkout
            </button>
            <Link
              href="/shop/products"
              className="block text-center text-sm text-primary font-semibold mt-4 hover:text-orange-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
