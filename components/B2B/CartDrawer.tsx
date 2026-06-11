"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userPlan?: "Professional" | "Enterprise";
}

export default function CartDrawer({ isOpen, onClose, userPlan = "Professional" }: CartDrawerProps) {
  const { items, removeItem, updateQty } = useCartStore();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountRate = userPlan === "Professional" ? 0.15 : userPlan === "Enterprise" ? 0.25 : 0.05;
  const discount = subtotal * discountRate;
  const afterDiscount = subtotal - discount;
  const gst = afterDiscount * 0.18;
  const total = afterDiscount + gst;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Drawer */}
          <motion.div
            data-testid="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-lg z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-neutral-900">Shopping Cart</h2>
              <button
                data-testid="cart-drawer-close"
                onClick={onClose}
                className="text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                // Empty State
                <div data-testid="cart-empty-state" className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <ShoppingBag size={48} className="text-slate-300 mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-neutral-600 mb-6">
                    Add spare parts to get started with your order
                  </p>
                  <button
                    data-testid="cart-browse-catalog-button"
                    onClick={onClose}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center gap-2"
                  >
                    <ArrowRight size={18} />
                    Browse Catalog
                  </button>
                </div>
              ) : (
                // Cart Items
                <div data-testid="cart-items-list" className="p-6 space-y-4">
                  {items.map((item) => (
                    <div
                      data-testid={`cart-item-${item.id}`}
                      data-cart-item-id={item.id}
                      key={item.id}
                      className="flex gap-4 p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                    >
                      {/* Image */}
                      <div className="flex-shrink-0 w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-2xl">
                        ⚙️
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-neutral-900 text-sm mb-1">
                          {item.name}
                        </h4>
                        <p className="text-xs text-neutral-600 mb-2">{item.brand}</p>

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-neutral-900 text-sm">
                            ₹{item.price.toLocaleString("en-IN")}
                          </span>
                          <span className="text-xs text-neutral-500 line-through">
                            ₹{item.mrp.toLocaleString("en-IN")}
                          </span>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-2">
                          <button
                            data-testid={`cart-item-decrement-${item.id}`}
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="p-1 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span data-testid={`cart-item-quantity-${item.id}`} className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            data-testid={`cart-item-increment-${item.id}`}
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="p-1 border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title={item.quantity >= item.stock ? "Max stock reached" : ""}
                          >
                            <Plus size={14} />
                          </button>
                          <span className="text-xs text-neutral-500 ml-auto">
                            Stock: {item.stock}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col items-end gap-2">
                        <span className="font-semibold text-neutral-900">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                        <button
                          data-testid={`cart-item-remove-${item.id}`}
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer - Pricing & Actions */}
            {items.length > 0 && (
              <div data-testid="cart-summary" className="border-t border-slate-200 p-6 space-y-4 bg-slate-50">
                {/* Pricing Breakdown */}
                <div data-testid="cart-pricing-breakdown" className="space-y-2 text-sm">
                  <div className="flex justify-between text-neutral-700">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>
                        B2B Discount ({(discountRate * 100).toFixed(0)}%)
                      </span>
                      <span>-₹{discount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-700">
                    <span>GST (18%)</span>
                    <span>₹{gst.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-200">
                    <span>Total</span>
                    <span className="text-red-700">₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-2 pt-4">
                  <Link
                    data-testid="cart-checkout-button"
                    href="/checkout"
                    className="block w-full py-3 bg-primary text-white rounded-lg hover:bg-orange-600 font-semibold text-center transition-colors"
                    onClick={onClose}
                  >
                    Proceed to Checkout
                  </Link>
                  <button
                    data-testid="cart-continue-shopping-button"
                    onClick={onClose}
                    className="w-full py-2 border border-slate-300 text-neutral-900 rounded-lg hover:bg-slate-100 font-medium transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
