"use client";

import { useState } from "react";
import { Search, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { mockOrders } from "@/lib/mockOrders";
import TrackingModal from "@/components/B2B/TrackingModal";

export default function GuestTrackingPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [searchError, setSearchError] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError("");

    if (!orderNumber.trim() || !phone.trim()) {
      setSearchError("Please enter both Order ID and Phone Number");
      return;
    }

    // In production: GET /api/b2b/track?orderId={orderNumber}&phone={phone}
    const found = mockOrders.find(
      (order) => order.orderNumber === orderNumber && order.customerPhone?.includes(phone.slice(-10))
    );

    if (found) {
      setSelectedOrder(found);
      setTrackingOpen(true);
    } else {
      setSearchError("Order not found. Please check your Order ID and Phone Number.");
    }
  };

  return (
    <div data-testid="track-page" className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container-app py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Track Your Order</h1>
            <p className="text-neutral-600">Enter your Order ID and Phone Number to track your SpareKart delivery</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-app py-12">
        <div className="max-w-2xl mx-auto">
          {/* Search Card */}
          <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-8 mb-8">
            <form onSubmit={handleSearch} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">Order ID</label>
                <input
                  type="text"
                  placeholder="e.g., ORD-2024-001"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-base"
                />
                <p className="text-xs text-neutral-600 mt-2">You'll find this in your order confirmation email</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g., +91-9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-base"
                />
                <p className="text-xs text-neutral-600 mt-2">The phone number used during order placement</p>
              </div>

              {searchError && (
                <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{searchError}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Search size={20} />
                Track Order
              </button>
            </form>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <CheckCircle size={20} className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-neutral-900">Real-time Updates</h3>
              </div>
              <p className="text-sm text-neutral-600">Get live tracking updates every 2 minutes</p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle size={20} className="text-green-600" />
                </div>
                <h3 className="font-semibold text-neutral-900">WhatsApp Alerts</h3>
              </div>
              <p className="text-sm text-neutral-600">Receive delivery updates on WhatsApp</p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle size={20} className="text-primary" />
                </div>
                <h3 className="font-semibold text-neutral-900">Courier Support</h3>
              </div>
              <p className="text-sm text-neutral-600">Contact courier directly for assistance</p>
            </div>
          </div>

          {/* Demo Orders */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Sample Orders (for testing)</h2>
            <div className="grid grid-cols-1 gap-3">
              {mockOrders.slice(0, 3).map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-lg border border-slate-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    setOrderNumber(order.orderNumber);
                    setPhone(order.customerPhone || "");
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-neutral-900">{order.orderNumber}</p>
                      <p className="text-sm text-neutral-600">Phone: {order.customerPhone}</p>
                    </div>
                    <span className="text-sm text-primary font-medium">Click to try →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedOrder && (
        <TrackingModal
          isOpen={trackingOpen}
          onClose={() => {
            setTrackingOpen(false);
            setOrderNumber("");
            setPhone("");
          }}
          order={selectedOrder}
        />
      )}

      {/* Footer */}
      <div className="bg-white border-t border-slate-200 mt-12">
        <div className="container-app py-8">
          <div className="text-center">
            <p className="text-neutral-600 mb-4">Have a SpareKart B2B account?</p>
            <Link href="/b2b/login" className="text-primary hover:text-primary/80 font-semibold">
              Sign in to your account for more features →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
