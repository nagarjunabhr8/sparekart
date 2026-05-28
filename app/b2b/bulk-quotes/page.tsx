"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, Download } from "lucide-react";
import toast from "react-hot-toast";

interface BulkQuote {
  id: string;
  parts: Array<{
    name: string;
    brand: string;
    quantity: number;
    price: number;
  }>;
  deliveryDate: string;
  address: string;
  status: "pending" | "quoted" | "accepted" | "rejected";
  total: number;
  createdAt: string;
  accountManagerName?: string;
  accountManagerEmail?: string;
  accountManagerPhone?: string;
  estimatedDeliveryDate?: string;
  quotedPrice?: number;
}

const statusBadgeColors = {
  pending: "bg-amber-100 text-amber-700",
  quoted: "bg-blue-100 text-blue-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const mockBulkQuotes: BulkQuote[] = [
  {
    id: "BQ-00001",
    parts: [
      { name: "Air Filter Element", brand: "Bosch", quantity: 50, price: 1275 },
      { name: "Oil Filter", brand: "NGK", quantity: 30, price: 553 },
    ],
    deliveryDate: "2026-06-10",
    address: "123 Main St, Bangalore",
    status: "quoted",
    total: 82500,
    createdAt: "2026-05-20",
    quotedPrice: 75000,
    accountManagerName: "Rajesh Kumar",
    accountManagerEmail: "rajesh@sparekart.com",
    accountManagerPhone: "+91-9876543210",
    estimatedDeliveryDate: "2026-06-08",
  },
  {
    id: "BQ-00002",
    parts: [
      { name: "Cabin Air Filter", brand: "Mann", quantity: 25, price: 756 },
    ],
    deliveryDate: "2026-05-30",
    address: "456 Park Rd, Bangalore",
    status: "pending",
    total: 18900,
    createdAt: "2026-05-26",
  },
  {
    id: "BQ-00003",
    parts: [
      { name: "Spark Plugs", brand: "Denso", quantity: 100, price: 1020 },
    ],
    deliveryDate: "2026-06-15",
    address: "789 Oak Ave, Bangalore",
    status: "accepted",
    total: 102000,
    createdAt: "2026-05-15",
    quotedPrice: 92000,
    estimatedDeliveryDate: "2026-06-12",
  },
];

export default function BulkQuotesPage() {
  const [quotes, setQuotes] = useState<BulkQuote[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "quoted" | "accepted" | "rejected">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<BulkQuote | null>(null);

  useEffect(() => {
    // Fetch quotes from API
    const fetchQuotes = async () => {
      try {
        // For now, use mock data
        setQuotes(mockBulkQuotes);
      } catch (error) {
        toast.error("Failed to load bulk quotes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  const filteredQuotes =
    filter === "all" ? quotes : quotes.filter((q) => q.status === filter);

  if (isLoading) {
    return (
      <div data-testid="bulk-quotes-loading" className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-neutral-600">Loading bulk quotes...</div>
      </div>
    );
  }

  return (
    <div data-testid="bulk-quotes-page" className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="container-app py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Bulk Quote Requests</h1>
              <p className="text-neutral-600 text-sm mt-1">
                {filteredQuotes.length} quote{filteredQuotes.length !== 1 ? "s" : ""} found
              </p>
            </div>
            <Link
              href="/b2b/catalog"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              + New Bulk Order
            </Link>
          </div>

          {/* Status Filters */}
          <div className="flex gap-2 flex-wrap">
            {["all", "pending", "quoted", "accepted", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === status
                    ? "bg-primary text-white"
                    : "bg-slate-100 text-neutral-700 hover:bg-slate-200"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quotes List */}
      <div className="container-app py-8">
        {filteredQuotes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">
              No bulk quotes yet
            </h3>
            <p className="text-neutral-600 mb-6">
              Start creating bulk orders to request custom quotes from our team.
            </p>
            <Link
              href="/b2b/catalog"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors inline-block"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuotes.map((quote) => (
              <div
                key={quote.id}
                className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Quote Info */}
                  <div>
                    <p className="text-xs text-neutral-500 uppercase font-semibold mb-1">
                      Quote ID
                    </p>
                    <p className="text-lg font-bold text-neutral-900">{quote.id}</p>
                    <p className="text-xs text-neutral-600 mt-2">
                      {new Date(quote.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  {/* Parts Summary */}
                  <div>
                    <p className="text-xs text-neutral-500 uppercase font-semibold mb-2">
                      Parts
                    </p>
                    <div className="space-y-1">
                      {quote.parts.slice(0, 2).map((part, idx) => (
                        <p key={idx} className="text-sm text-neutral-700">
                          {part.name} ×{part.quantity}
                        </p>
                      ))}
                      {quote.parts.length > 2 && (
                        <p className="text-sm text-neutral-500">
                          +{quote.parts.length - 2} more
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status & Price */}
                  <div>
                    <p className="text-xs text-neutral-500 uppercase font-semibold mb-2">
                      Status
                    </p>
                    <div className="space-y-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          statusBadgeColors[quote.status]
                        }`}
                      >
                        {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                      </span>
                      {quote.quotedPrice && (
                        <p className="text-sm">
                          <span className="text-neutral-600">Quoted: </span>
                          <span className="font-bold text-red-700">
                            ₹{quote.quotedPrice.toLocaleString("en-IN")}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setSelectedQuote(quote)}
                      className="px-4 py-2 bg-slate-100 text-neutral-900 rounded-lg hover:bg-slate-200 font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                    {quote.status === "quoted" && (
                      <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 font-semibold transition-colors">
                        Accept Quote
                      </button>
                    )}
                    {quote.quotedPrice && (
                      <button className="px-4 py-2 bg-slate-100 text-neutral-900 rounded-lg hover:bg-slate-200 text-sm flex items-center justify-center gap-2 transition-colors">
                        <Download size={14} />
                        Invoice
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quote Details Modal */}
      {selectedQuote && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedQuote(null)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between rounded-t-lg">
              <h2 className="text-xl font-bold text-neutral-900">
                Quote Details - {selectedQuote.id}
              </h2>
              <button
                onClick={() => setSelectedQuote(null)}
                className="text-neutral-600 hover:text-neutral-900"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status & Dates */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-neutral-500 uppercase font-semibold mb-1">
                    Status
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      statusBadgeColors[selectedQuote.status]
                    }`}
                  >
                    {selectedQuote.status.charAt(0).toUpperCase() +
                      selectedQuote.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 uppercase font-semibold mb-1">
                    Requested Delivery
                  </p>
                  <p className="font-semibold text-neutral-900">
                    {new Date(selectedQuote.deliveryDate).toLocaleDateString("en-IN")}
                  </p>
                </div>
                {selectedQuote.estimatedDeliveryDate && (
                  <div>
                    <p className="text-xs text-neutral-500 uppercase font-semibold mb-1">
                      Estimated Delivery
                    </p>
                    <p className="font-semibold text-green-700">
                      {new Date(selectedQuote.estimatedDeliveryDate).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                )}
              </div>

              {/* Parts Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left p-3 font-semibold">Part</th>
                      <th className="text-right p-3 font-semibold">Price</th>
                      <th className="text-center p-3 font-semibold">Qty</th>
                      <th className="text-right p-3 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedQuote.parts.map((part, idx) => (
                      <tr key={idx} className="border-b border-slate-100">
                        <td className="p-3">
                          <p className="font-medium">{part.name}</p>
                          <p className="text-xs text-neutral-500">{part.brand}</p>
                        </td>
                        <td className="p-3 text-right">
                          ₹{part.price.toLocaleString("en-IN")}
                        </td>
                        <td className="p-3 text-center">{part.quantity}</td>
                        <td className="p-3 text-right font-semibold">
                          ₹{(part.price * part.quantity).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pricing */}
              <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-semibold">
                    ₹{selectedQuote.total.toLocaleString("en-IN")}
                  </span>
                </div>
                {selectedQuote.quotedPrice && (
                  <>
                    <div className="flex justify-between text-green-700">
                      <span>Our Quote</span>
                      <span className="font-semibold">
                        ₹{selectedQuote.quotedPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between text-green-700 pt-2 border-t border-slate-200">
                      <span>Your Savings</span>
                      <span className="font-semibold">
                        ₹{(selectedQuote.total - selectedQuote.quotedPrice).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Account Manager Info (if available) */}
              {selectedQuote.accountManagerName && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-blue-900 mb-3">
                    Your Dedicated Account Manager
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Name:</span> {selectedQuote.accountManagerName}
                    </p>
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Email:</span>{" "}
                      <a href={`mailto:${selectedQuote.accountManagerEmail}`} className="hover:underline">
                        {selectedQuote.accountManagerEmail}
                      </a>
                    </p>
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Phone:</span>{" "}
                      <a href={`tel:${selectedQuote.accountManagerPhone}`} className="hover:underline">
                        {selectedQuote.accountManagerPhone}
                      </a>
                    </p>
                  </div>
                </div>
              )}

              {/* Delivery Address */}
              <div>
                <p className="text-xs text-neutral-500 uppercase font-semibold mb-2">
                  Delivery Address
                </p>
                <p className="text-sm text-neutral-700">{selectedQuote.address}</p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedQuote(null)}
                className="w-full py-2 bg-slate-200 text-neutral-900 rounded-lg hover:bg-slate-300 font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
