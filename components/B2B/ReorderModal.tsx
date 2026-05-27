"use client";

import { X, ShoppingCart, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Order } from "@/lib/mockOrders";

interface ReorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

export default function ReorderModal({ isOpen, onClose, order }: ReorderModalProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isOpen) return null;

  const handleReorder = () => {
    setIsConfirming(true);
    setTimeout(() => {
      // Add items to cart
      console.log("Added to cart:", order.items);
      onClose();
      setIsConfirming(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900">Reorder Confirmation</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-neutral-600 mb-6">
            Are you sure you want to add all items from order <span className="font-semibold">{order.orderNumber}</span> to your cart?
          </p>

          {/* Items Summary */}
          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-neutral-900 mb-3">Items to Add ({order.itemCount} total)</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-start justify-between text-sm">
                  <div>
                    <p className="text-neutral-900 font-medium">{item.name}</p>
                    <p className="text-neutral-600 text-xs">{item.brand}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-neutral-900 font-medium">x{item.quantity}</p>
                    <p className="text-neutral-600 text-xs">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 mb-6 pb-4 border-b border-slate-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Subtotal</span>
              <span className="text-neutral-900">₹{order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Discount</span>
                <span className="text-green-600">-₹{order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">GST</span>
              <span className="text-neutral-900">₹{order.gst.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between font-semibold text-base pt-2">
              <span>Total</span>
              <span>₹{order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Note */}
          <div className="flex gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg mb-6">
            <AlertCircle size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900">
              Items will be added to your cart. Prices may have changed since the original order.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            disabled={isConfirming}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleReorder}
            disabled={isConfirming}
            className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <ShoppingCart size={18} />
            {isConfirming ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
