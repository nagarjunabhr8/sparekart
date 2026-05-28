"use client";

import { useEffect, useState } from "react";
import { X, MapPin, Phone, ExternalLink, MessageCircle, Clock, CheckCircle } from "lucide-react";
import { Order } from "@/lib/mockOrders";

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

export default function TrackingModal({ isOpen, onClose, order }: TrackingModalProps) {
  const trackingData = order;
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    if (!isOpen) return;
    const pollInterval = setInterval(() => {
      setLastUpdated(new Date());
      // In production: GET /api/b2b/orders/{id}/tracking
    }, 2 * 60 * 1000);
    return () => clearInterval(pollInterval);
  }, [isOpen]);

  if (!isOpen || !trackingData) return null;

  const handleWhatsAppClick = () => {
    const message = `Hi! I'd like to get tracking updates for order ${order.orderNumber} on WhatsApp.`;
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = order.customerPhone?.replace(/\D/g, "") || "919876543210";
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  };

  return (
    <div data-testid="tracking-modal" className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Track Your Order</h2>
            <p data-testid="tracking-modal-order-number" className="text-sm text-neutral-600 mt-1">{order.orderNumber}</p>
          </div>
          <button data-testid="tracking-modal-close" onClick={onClose} className="p-2 hover:bg-slate-100 rounded transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Items Summary */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-semibold text-neutral-900 mb-3">Items in This Order</h3>
            <div className="space-y-2">
              {order.items.slice(0, 2).map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-700">
                    {item.name} <span className="text-neutral-600">x{item.quantity}</span>
                  </span>
                  <span className="text-neutral-900 font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              {order.items.length > 2 && (
                <p className="text-sm text-neutral-600 mt-2">+{order.items.length - 2} more items</p>
              )}
            </div>
          </div>

          {/* Estimated Delivery */}
          {order.estimatedDelivery && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle size={24} className="text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm text-green-900 font-medium">Estimated Delivery</p>
                  <p className="text-lg font-bold text-green-700">
                    {new Date(order.estimatedDelivery).toLocaleDateString("en-IN", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tracking Steps - Vertical Timeline */}
          {trackingData.trackingSteps && (
            <div className="space-y-4">
              <h3 className="font-semibold text-neutral-900">Delivery Timeline</h3>
              <div className="space-y-4">
                {trackingData.trackingSteps.map((step, index) => (
                  <div key={step.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0 ${
                          step.completed
                            ? "bg-green-500 text-white"
                            : step.current
                              ? "bg-primary text-white"
                              : "bg-slate-300 text-slate-600"
                        }`}
                      >
                        {step.completed ? <CheckCircle size={20} /> : index + 1}
                      </div>
                      {index < trackingData.trackingSteps!.length - 1 && (
                        <div
                          className={`w-0.5 h-16 ${step.completed ? "bg-green-500" : "bg-slate-300"}`}
                        />
                      )}
                    </div>
                    <div className="pb-4 flex-1">
                      <p
                        className={`font-semibold ${
                          step.completed || step.current ? "text-neutral-900" : "text-neutral-500"
                        }`}
                      >
                        {step.name}
                      </p>
                      {step.location && (
                        <div className="flex items-center gap-1 text-sm text-neutral-600 mt-2">
                          <MapPin size={14} />
                          {step.location}
                        </div>
                      )}
                      {step.timestamp && (
                        <p className="text-xs text-neutral-500 mt-2">
                          {new Date(step.timestamp).toLocaleString("en-IN", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Courier Details */}
          {trackingData.courier && (
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-semibold text-neutral-900 mb-4">Courier Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img src={trackingData.courier.logo} alt={trackingData.courier.name} className="w-12 h-12" />
                  <div>
                    <p className="font-semibold text-neutral-900">{trackingData.courier.name}</p>
                    <p className="text-sm text-neutral-600">Tracking ID: {trackingData.courier.trackingNumber}</p>
                  </div>
                </div>
                <div className="border-t border-slate-200 pt-4 space-y-3">
                  {trackingData.courier.contactNumber && (
                    <div className="flex items-center gap-2">
                      <Phone size={18} className="text-primary" />
                      <span className="text-sm text-neutral-900">{trackingData.courier.contactNumber}</span>
                    </div>
                  )}
                  <a
                    href={trackingData.courier.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    Track on courier site
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Current Location - Map Placeholder */}
          {trackingData.currentLocation && (
            <div className="space-y-2">
              <h3 className="font-semibold text-neutral-900">Current Location</h3>
              <div className="bg-slate-100 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={32} className="text-primary mx-auto mb-2" />
                  <p className="text-neutral-700 font-medium">{trackingData.currentLocation.address}</p>
                  <p className="text-xs text-neutral-600 mt-1">
                    Last updated: {new Date(trackingData.currentLocation.timestamp).toLocaleTimeString("en-IN")}
                  </p>
                  <p className="text-xs text-neutral-500 mt-3">
                    📍 {trackingData.currentLocation.latitude.toFixed(4)}, {trackingData.currentLocation.longitude.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Last Updated */}
          <div className="flex items-center gap-2 text-xs text-neutral-500 px-4 py-2 bg-slate-50 rounded">
            <Clock size={14} />
            Last updated: {lastUpdated.toLocaleTimeString("en-IN")}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4 flex gap-3 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            Close
          </button>
          <button
            onClick={handleWhatsAppClick}
            className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
          >
            <MessageCircle size={18} />
            WhatsApp Updates
          </button>
        </div>
      </div>
    </div>
  );
}
