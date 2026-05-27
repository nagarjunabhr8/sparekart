"use client";

import { X, MapPin, Package, CheckCircle } from "lucide-react";
import { Order } from "@/lib/mockOrders";

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

const mockTrackingSteps = [
  { status: "Order Placed", date: "2024-05-20", location: "Warehouse" },
  { status: "Confirmed", date: "2024-05-20", location: "Processing Center" },
  { status: "Shipped", date: "2024-05-21", location: "In Transit" },
  { status: "Out for Delivery", date: "2024-05-23", location: "Local Hub" },
  { status: "Delivered", date: "2024-05-24", location: "Destination" },
];

export default function TrackingModal({ isOpen, onClose, order }: TrackingModalProps) {
  if (!isOpen) return null;

  const currentStepIndex = mockTrackingSteps.findIndex(
    (step) => step.status.toLowerCase().replace(" ", "_") === order.status
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Track Order</h2>
            <p className="text-sm text-neutral-600 mt-1">{order.orderNumber}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Tracking Info */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-neutral-600">Tracking Number</p>
                <p className="text-lg font-semibold text-neutral-900">{order.trackingNumber}</p>
              </div>
              {order.estimatedDelivery && (
                <div className="text-right">
                  <p className="text-sm text-neutral-600">Estimated Delivery</p>
                  <p className="text-lg font-semibold text-neutral-900">
                    {new Date(order.estimatedDelivery).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-900 mb-4">Delivery Timeline</h3>
            {mockTrackingSteps.map((step, index) => (
              <div key={step.status} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index <= (currentStepIndex >= 0 ? currentStepIndex : -1)
                        ? "bg-green-500 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {index <= (currentStepIndex >= 0 ? currentStepIndex : -1) ? (
                      <CheckCircle size={20} />
                    ) : (
                      <Package size={20} />
                    )}
                  </div>
                  {index < mockTrackingSteps.length - 1 && (
                    <div
                      className={`w-0.5 h-16 ${
                        index < (currentStepIndex >= 0 ? currentStepIndex : -1)
                          ? "bg-green-500"
                          : "bg-slate-200"
                      }`}
                    />
                  )}
                </div>
                <div className="pb-4">
                  <p
                    className={`font-semibold ${
                      index <= (currentStepIndex >= 0 ? currentStepIndex : -1)
                        ? "text-neutral-900"
                        : "text-neutral-500"
                    }`}
                  >
                    {step.status}
                  </p>
                  <p className="text-sm text-neutral-600 mt-1">{step.date}</p>
                  <div className="flex items-center gap-1 text-sm text-neutral-500 mt-2">
                    <MapPin size={14} />
                    {step.location}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          {order.notes && (
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
