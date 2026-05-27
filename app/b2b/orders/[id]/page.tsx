"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Printer,
  MapPin,
  CreditCard,
  Clock,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
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

const stepperSteps = [
  { label: "Placed", key: "pending" },
  { label: "Confirmed", key: "confirmed" },
  { label: "Shipped", key: "shipped" },
  { label: "Out for Delivery", key: "out_for_delivery" },
  { label: "Delivered", key: "delivered" },
];

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
  const canCancel = ["pending", "confirmed"].includes(order.status);

  const getCurrentStepIndex = () => {
    const stepMap: Record<string, number> = {
      pending: 0,
      confirmed: 1,
      shipped: 2,
      out_for_delivery: 3,
      delivered: 4,
    };
    return stepMap[order.status] ?? -1;
  };

  const handleDownloadInvoice = () => {
    const link = document.createElement("a");
    link.href = order.invoiceUrl;
    link.download = `${order.orderNumber}-invoice.pdf`;
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const currentStep = getCurrentStepIndex();

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white; }
          .container { max-width: 100%; }
        }
        .print-only { display: none; }
      `}</style>

      <div className="min-h-screen bg-slate-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-200 no-print">
          <div className="container-app py-4">
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Link href="/b2b" className="hover:text-primary transition-colors">
                Dashboard
              </Link>
              <span>/</span>
              <Link href="/b2b/orders" className="hover:text-primary transition-colors">
                Orders
              </Link>
              <span>/</span>
              <span className="text-neutral-900 font-semibold">{order.orderNumber}</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="container-app py-6">
            <div className="flex items-start justify-between mb-6 no-print">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <ArrowLeft size={20} />
                Back
              </button>
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-neutral-900 rounded-lg transition-colors font-medium"
                >
                  <Printer size={18} />
                  Print
                </button>
                <button
                  onClick={handleDownloadInvoice}
                  className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium"
                >
                  <Download size={18} />
                  Invoice
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">{order.orderNumber}</h1>
              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <p className="text-sm text-neutral-600">Order Date</p>
                  <p className="text-neutral-900 font-medium">
                    {new Date(order.date).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                {order.estimatedDelivery && (
                  <div>
                    <p className="text-sm text-neutral-600">Est. Delivery</p>
                    <p className="text-neutral-900 font-medium">
                      {new Date(order.estimatedDelivery).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-neutral-600">Status</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}>
                    {config.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Stepper */}
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                {stepperSteps.map((step, index) => (
                  <div key={step.key} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                          index < currentStep + 1
                            ? "bg-green-500 text-white"
                            : index === currentStep
                              ? "bg-primary text-white"
                              : "bg-slate-300 text-slate-600"
                        }`}
                      >
                        {index < currentStep ? <Check size={18} /> : index + 1}
                      </div>
                      <p
                        className={`text-xs font-medium mt-2 text-center ${
                          index <= currentStep ? "text-neutral-900" : "text-neutral-500"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                    {index < stepperSteps.length - 1 && (
                      <div
                        className={`h-0.5 flex-1 mx-2 ${index < currentStep ? "bg-green-500" : "bg-slate-300"}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container-app py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Items and Breakdown */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                  <h2 className="text-lg font-bold text-neutral-900">Order Items</h2>
                </div>
                <div className="divide-y divide-slate-200">
                  {order.items.map((item) => (
                    <div key={item.id} className="p-6 flex items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900">{item.name}</h3>
                        <p className="text-sm text-neutral-600 mt-1">{item.brand}</p>
                        <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                          <div>
                            <p className="text-neutral-600">Quantity</p>
                            <p className="font-medium text-neutral-900">{item.quantity}</p>
                          </div>
                          <div>
                            <p className="text-neutral-600">Unit Price</p>
                            <p className="font-medium text-neutral-900">₹{item.price.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-neutral-600">Line Total</p>
                            <p className="font-semibold text-neutral-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                      {isActive && !order.status.includes("delivered") && (
                        <button className="px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition-colors text-sm font-medium no-print">
                          Return
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Breakdown */}
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-neutral-900 mb-4">Order Breakdown</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Subtotal</span>
                    <span className="text-neutral-900 font-medium">₹{order.subtotal.toFixed(2)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">B2B Discount</span>
                      <span className="text-green-600 font-medium">-₹{order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  {order.deliveryFee !== undefined && order.deliveryFee > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Delivery Fee</span>
                      <span className="text-neutral-900 font-medium">₹{order.deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">GST (18%)</span>
                    <span className="text-neutral-900 font-medium">₹{order.gst.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-neutral-900">Grand Total</span>
                    <span className="text-2xl font-bold text-primary">₹{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              {order.timeline && order.timeline.length > 0 && (
                <div className="bg-white rounded-lg border border-slate-200 p-6">
                  <h2 className="text-lg font-bold text-neutral-900 mb-6">Order Timeline</h2>
                  <div className="space-y-4">
                    {order.timeline.map((event, index) => (
                      <div key={event.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0">
                            <Check size={16} />
                          </div>
                          {index < order.timeline!.length - 1 && <div className="w-0.5 h-12 bg-slate-200 my-2" />}
                        </div>
                        <div className="pb-4">
                          <p className="font-semibold text-neutral-900">{event.event}</p>
                          {event.description && (
                            <p className="text-sm text-neutral-600 mt-1">{event.description}</p>
                          )}
                          <p className="text-xs text-neutral-500 mt-2">
                            {new Date(event.timestamp).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Delivery & Payment */}
            <div className="space-y-6">
              {/* Delivery Address */}
              {order.deliveryAddress && (
                <div className="bg-white rounded-lg border border-slate-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin size={20} className="text-primary" />
                    <h2 className="text-lg font-bold text-neutral-900">Delivery Address</h2>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold text-neutral-900">{order.deliveryAddress.name}</p>
                    <p className="text-neutral-600">{order.deliveryAddress.address}</p>
                    <p className="text-neutral-600">
                      {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                    </p>
                    <p className="text-neutral-600">{order.deliveryAddress.country}</p>
                    <div className="border-t border-slate-200 pt-2 mt-2">
                      <p className="text-neutral-600">
                        <span className="font-medium">Phone:</span> {order.deliveryAddress.phone}
                      </p>
                      <p className="text-neutral-600">
                        <span className="font-medium">Email:</span> {order.deliveryAddress.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Summary */}
              {order.paymentInfo && (
                <div className="bg-white rounded-lg border border-slate-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard size={20} className="text-primary" />
                    <h2 className="text-lg font-bold text-neutral-900">Payment Summary</h2>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Payment Method</span>
                      <span className="font-medium text-neutral-900 capitalize">
                        {order.paymentInfo.method.replace("_", " ")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Transaction ID</span>
                      <span className="font-medium text-neutral-900 text-xs">{order.paymentInfo.transactionId}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Amount</span>
                      <span className="font-semibold text-neutral-900">₹{order.paymentInfo.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Paid At</span>
                      <span className="font-medium text-neutral-900">
                        {new Date(order.paymentInfo.paidAt).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                    <div className="border-t border-slate-200 pt-2 mt-2">
                      <div className="flex items-center gap-2">
                        {order.paymentInfo.status === "completed" ? (
                          <>
                            <Check size={16} className="text-green-600" />
                            <span className="text-green-600 font-medium">Payment Completed</span>
                          </>
                        ) : order.paymentInfo.status === "pending" ? (
                          <>
                            <Clock size={16} className="text-amber-600" />
                            <span className="text-amber-600 font-medium">Payment Pending</span>
                          </>
                        ) : (
                          <>
                            <X size={16} className="text-red-600" />
                            <span className="text-red-600 font-medium">Payment Failed</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="bg-white rounded-lg border border-slate-200 p-6 no-print">
                <h2 className="text-lg font-bold text-neutral-900 mb-4">Actions</h2>
                <div className="space-y-2">
                  {isActive && (
                    <button
                      onClick={() => setTrackingOpen(true)}
                      className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-neutral-900 rounded-lg transition-colors font-medium"
                    >
                      Track Order
                    </button>
                  )}
                  <button
                    onClick={() => setReorderOpen(true)}
                    className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium"
                  >
                    Reorder Items
                  </button>
                  {order.status === "delivered" && (
                    <button className="w-full px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition-colors font-medium">
                      Raise Return/Refund
                    </button>
                  )}
                  {canCancel && (
                    <button className="w-full px-4 py-2 border-2 border-red-600 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-2">
                    <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">Order Notes</p>
                      <p className="text-sm text-blue-800">{order.notes}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        <TrackingModal isOpen={trackingOpen} onClose={() => setTrackingOpen(false)} order={order} />
        <ReorderModal isOpen={reorderOpen} onClose={() => setReorderOpen(false)} order={order} />
      </div>
    </>
  );
}
