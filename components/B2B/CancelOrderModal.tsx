"use client";

import { X, AlertTriangle, Loader } from "lucide-react";
import { useState } from "react";
import { Order } from "@/lib/mockOrders";
import toast from "react-hot-toast";
import { analytics } from "@/lib/analytics";

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onSuccess?: () => void;
}

export default function CancelOrderModal({
  isOpen,
  onClose,
  order,
  onSuccess,
}: CancelOrderModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleCancel = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/b2b/orders/${order.id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason || "No specific reason" }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to cancel order");
      }

      const data = await response.json();

      // Track analytics
      analytics.track("order_cancelled", {
        orderId: order.id,
        orderNumber: order.orderNumber,
        reason: reason || "Not specified",
        orderTotal: order.total,
      });

      toast.success(
        `Order ${order.orderNumber} cancelled successfully`
      );

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      console.error("Cancellation error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to cancel order"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900">Cancel Order</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 hover:bg-slate-100 rounded transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Warning */}
          <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle size={20} className="text-red-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-900">Are you sure?</p>
              <p className="text-sm text-red-800 mt-1">
                This action cannot be undone. The order will be permanently cancelled.
              </p>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Order ID</span>
              <span className="font-medium text-neutral-900">{order.orderNumber}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Items</span>
              <span className="font-medium text-neutral-900">{order.itemCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Total Amount</span>
              <span className="font-semibold text-neutral-900">₹{order.total.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Current Status</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                {order.status.replace("_", " ").toUpperCase()}
              </span>
            </div>
          </div>

          {/* Cancellation Reason */}
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Reason for cancellation (optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Tell us why you're cancelling this order..."
              disabled={isLoading}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm disabled:opacity-50 disabled:bg-slate-50"
              rows={3}
            />
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-900">
              <span className="font-semibold">Note:</span> Once cancelled, items cannot be reordered from this order.
              You can place a new order for the same items anytime.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium disabled:opacity-50"
          >
            Keep Order
          </button>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Cancelling...
              </>
            ) : (
              "Cancel Order"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
