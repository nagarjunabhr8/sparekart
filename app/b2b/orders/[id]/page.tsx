"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, Truck, RotateCcw } from "lucide-react";
import Link from "next/link";
import { mockOrders } from "@/lib/mockOrders";
import TrackingModal from "@/components/B2B/TrackingModal";
import ReorderModal from "@/components/B2B/ReorderModal";

const statusConfig = {
  pending: { bg: "bg-amber-100", text: "text-amber-800", label: "Pending" },
  confirmed: { bg: "bg-blue-100", text: "text-blue-800", label: "Confirmed" },
  processing: { bg: "bg-purple-100", text: "text-purple-800", label: "Processing" },
  shipped: { bg: "bg-indigo-100", text: "text-indigo-800", label: "Shipped" },
  out_for_delivery: { bg: "bg-orange-100", text: "text-orange-800", label: "Out for Delivery" },
  delivered: { bg: "bg-green-100", text: "text-green-800", label: "Delivered" },
  cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Cancelled" },
  return_initiated: { bg: "bg-orange-100", text: "text-orange-800", label: "Return Initiated" },
};

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [reorderOpen, setReorderOpen] = useState(false);

  const order = mockOrders.find((o) => o.id === params.id);

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container-app py-8">
          <div className="text-center py-16 bg-white rounded-lg border border-slate-200">
            <p className="text-neutral-900 font-semibold mb-4">Order not found</p>
            <Link href="/b2b/orders" className="text-primary hover:underline">
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const config = statusConfig[order.status as keyof typeof statusConfig];
  const isActive = ["pending", "confirmed", "processing", "shipped", "out_for_delivery"].includes(order.status);

  const handleDownloadInvoice = () => {
    const link = document.createElement("a");
    link.href = order.invoiceUrl;
    link.download = `${order.orderNumber}-invoice.pdf`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container-app py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-primary hover:text-primary/80 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Orders
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">{order.orderNumber}</h1>
              <p className="text-neutral-600 text-sm mt-1">
                {new Date(order.date).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}>
              {config.label}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-app py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-neutral-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-start justify-between pb-4 border-b border-slate-200 last:border-0">
                    <div>
                      <p className="font-semibold text-neutral-900">{item.name}</p>
                      <p className="text-sm text-neutral-600 mt-1">{item.brand}</p>
                      <p className="text-sm text-neutral-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-neutral-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-xs text-neutral-600">₹{item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-neutral-900 mb-4">Pricing Breakdown</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="text-neutral-900 font-medium">₹{order.subtotal.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Discount (B2B)</span>
                    <span className="text-green-600 font-medium">-₹{order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">GST (18%)</span>
                  <span className="text-neutral-900 font-medium">₹{order.gst.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                  <span className="font-semibold text-neutral-900">Total Amount</span>
                  <span className="text-xl font-bold text-neutral-900">₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Order Notes */}
            {order.notes && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900 font-medium">Notes</p>
                <p className="text-sm text-blue-800 mt-2">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Timeline */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-neutral-900 mb-4">Order Status</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-neutral-600 uppercase font-semibold">Order Date</p>
                  <p className="text-neutral-900 font-medium mt-1">
                    {new Date(order.date).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                {order.estimatedDelivery && (
                  <div>
                    <p className="text-xs text-neutral-600 uppercase font-semibold">Est. Delivery</p>
                    <p className="text-neutral-900 font-medium mt-1">
                      {new Date(order.estimatedDelivery).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}
                {order.deliveryDate && (
                  <div>
                    <p className="text-xs text-neutral-600 uppercase font-semibold">Delivered</p>
                    <p className="text-green-600 font-medium mt-1">
                      {new Date(order.deliveryDate).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}
                {order.trackingNumber && (
                  <div>
                    <p className="text-xs text-neutral-600 uppercase font-semibold">Tracking</p>
                    <p className="text-neutral-900 font-medium mt-1">{order.trackingNumber}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-neutral-900 mb-4">Actions</h2>
              <div className="space-y-2">
                <button
                  onClick={handleDownloadInvoice}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-neutral-900 rounded-lg transition-colors"
                >
                  <Download size={18} />
                  Download Invoice
                </button>
                {isActive && (
                  <button
                    onClick={() => setTrackingOpen(true)}
                    className="w-full flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-neutral-900 rounded-lg transition-colors"
                  >
                    <Truck size={18} />
                    Track Order
                  </button>
                )}
                <button
                  onClick={() => setReorderOpen(true)}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
                >
                  <RotateCcw size={18} />
                  Reorder Items
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TrackingModal isOpen={trackingOpen} onClose={() => setTrackingOpen(false)} order={order} />
      <ReorderModal isOpen={reorderOpen} onClose={() => setReorderOpen(false)} order={order} />
    </div>
  );
}
