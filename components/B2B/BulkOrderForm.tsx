"use client";

import { useState, useRef, useEffect } from "react";
import { X, Plus, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";

interface BulkOrderPart {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
}

interface SavedAddress {
  id: string;
  label: string;
  address: string;
}

interface BulkOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  userPlan?: "Starter" | "Professional" | "Enterprise";
  userGST?: string;
}

const mockParts = [
  { id: "part-1", name: "Air Filter Element", brand: "Bosch", price: 1275 },
  { id: "part-2", name: "Cabin Air Filter", brand: "Mann", price: 756 },
  { id: "part-3", name: "Oil Filter Premium", brand: "NGK", price: 553 },
  { id: "part-4", name: "Spark Plugs Set (4)", brand: "Denso", price: 1020 },
  { id: "part-5", name: "Engine Oil 5L", brand: "Castrol", price: 2125 },
  { id: "part-6", name: "Brake Pads Front", brand: "Brembo", price: 2890 },
  { id: "part-7", name: "Battery 45Ah", brand: "Exide", price: 3500 },
  { id: "part-8", name: "Alternator", brand: "Valeo", price: 4200 },
];

const mockAddresses: SavedAddress[] = [
  {
    id: "addr-1",
    label: "Workshop",
    address: "123 Main St, Bangalore, Karnataka 560001",
  },
  {
    id: "addr-2",
    label: "Branch Office",
    address: "456 Park Rd, Bangalore, Karnataka 560002",
  },
];

export default function BulkOrderForm({
  isOpen,
  onClose,
  userPlan = "Professional",
  userGST = "18AABCU1234F1Z5",
}: BulkOrderFormProps) {
  const [parts, setParts] = useState<BulkOrderPart[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPartSearch, setShowPartSearch] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("addr-1");
  const [newAddress, setNewAddress] = useState("");
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit-terms");
  const [gstInvoice, setGstInvoice] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredParts, setFilteredParts] = useState(mockParts);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = mockParts.filter(
        (part) =>
          part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          part.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredParts(filtered);
    } else {
      setFilteredParts(mockParts);
    }
  }, [searchQuery]);

  const handleAddPart = (part: typeof mockParts[0]) => {
    const existingPart = parts.find((p) => p.id === part.id);
    if (existingPart) {
      setParts(
        parts.map((p) =>
          p.id === part.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      setParts([
        ...parts,
        {
          id: part.id,
          name: part.name,
          brand: part.brand,
          price: part.price,
          quantity: 1,
        },
      ]);
    }
    setSearchQuery("");
    setShowPartSearch(false);
    toast.success(`${part.name} added`);
  };

  const handleRemovePart = (id: string) => {
    setParts(parts.filter((p) => p.id !== id));
  };

  const handleUpdateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      handleRemovePart(id);
    } else if (qty <= 500) {
      setParts(parts.map((p) => (p.id === id ? { ...p, quantity: qty } : p)));
    }
  };

  const bulkTotal = parts.reduce((sum, part) => sum + part.price * part.quantity, 0);
  const discountRate = userPlan === "Professional" ? 0.15 : userPlan === "Enterprise" ? 0.25 : 0.05;
  const discount = bulkTotal * discountRate;
  const subtotal = bulkTotal - discount;
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (parts.length === 0) {
      toast.error("Please add at least one part");
      return;
    }

    if (!deliveryDate) {
      toast.error("Please select a delivery date");
      return;
    }

    if (!selectedAddress && !newAddress) {
      toast.error("Please select or enter a delivery address");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/b2b/bulk-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parts,
          deliveryDate,
          address: useNewAddress ? newAddress : mockAddresses.find((a) => a.id === selectedAddress)?.address,
          specialInstructions,
          paymentMethod,
          gstInvoice,
          gstNumber: gstInvoice ? userGST : null,
          userPlan,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          `Bulk quote request #${data.quoteId} received!\nOur team will respond within 4 business hours.`,
          { duration: 5000 }
        );
        onClose();
        resetForm();
      } else {
        toast.error(data.message || "Failed to submit quote");
      }
    } catch (error) {
      console.error("Error submitting bulk quote:", error);
      toast.error("Failed to submit bulk quote");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setParts([]);
    setSearchQuery("");
    setDeliveryDate("");
    setSelectedAddress("addr-1");
    setNewAddress("");
    setUseNewAddress(false);
    setSpecialInstructions("");
    setPaymentMethod("credit-terms");
    setGstInvoice(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between rounded-t-lg">
          <h2 className="text-xl font-bold text-neutral-900">Request Bulk Quote</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Add Parts Section */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-3">
              Add Parts <span className="text-red-500">*</span>
            </label>

            {/* Part Search */}
            <div className="relative mb-4">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 text-neutral-400" size={16} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search parts by name or brand..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowPartSearch(true)}
                    className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPartSearch(!showPartSearch)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>

              {/* Search Results */}
              {showPartSearch && filteredParts.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {filteredParts.map((part) => (
                    <button
                      key={part.id}
                      type="button"
                      onClick={() => handleAddPart(part)}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-neutral-900">{part.name}</p>
                          <p className="text-xs text-neutral-500">{part.brand}</p>
                        </div>
                        <p className="font-semibold text-primary">
                          ₹{part.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Added Parts Table */}
            {parts.length > 0 ? (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left p-3 font-semibold">Part Name</th>
                      <th className="text-right p-3 font-semibold">Price</th>
                      <th className="text-center p-3 font-semibold">Qty</th>
                      <th className="text-right p-3 font-semibold">Total</th>
                      <th className="text-center p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {parts.map((part) => (
                      <tr key={part.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-3">
                          <p className="font-medium text-neutral-900">{part.name}</p>
                          <p className="text-xs text-neutral-500">{part.brand}</p>
                        </td>
                        <td className="p-3 text-right text-neutral-700">
                          ₹{part.price.toLocaleString("en-IN")}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-2 bg-slate-100 rounded w-20 mx-auto">
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(part.id, part.quantity - 1)}
                              className="px-2 py-1 hover:bg-slate-200 rounded"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              min="1"
                              max="500"
                              value={part.quantity}
                              onChange={(e) =>
                                handleUpdateQty(part.id, parseInt(e.target.value) || 1)
                              }
                              className="w-10 text-center bg-transparent font-semibold outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(part.id, part.quantity + 1)}
                              className="px-2 py-1 hover:bg-slate-200 rounded"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-3 text-right font-semibold text-neutral-900">
                          ₹{(part.price * part.quantity).toLocaleString("en-IN")}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemovePart(part.id)}
                            className="p-1 hover:bg-red-50 rounded text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pricing Summary */}
                <div className="bg-slate-50 p-4 border-t border-slate-200 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Subtotal</span>
                    <span className="font-semibold">₹{bulkTotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-700">
                    <span>B2B Discount ({(discountRate * 100).toFixed(0)}%)</span>
                    <span className="font-semibold">−₹{discount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-slate-200 pt-2">
                    <span className="text-neutral-600">After Discount</span>
                    <span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">GST (18%)</span>
                    <span className="font-semibold">₹{gst.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-200">
                    <span>Total Amount</span>
                    <span className="text-red-700">₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-slate-50 rounded-lg text-center text-neutral-600">
                No parts added yet. Search and add parts above.
              </div>
            )}
          </div>

          {/* Delivery Date */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Required Delivery Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-xs text-neutral-500 mt-1">Select a date at least 2 business days from today</p>
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Delivery Address <span className="text-red-500">*</span>
            </label>
            {!useNewAddress ? (
              <div className="space-y-2">
                <select
                  value={selectedAddress}
                  onChange={(e) => setSelectedAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {mockAddresses.map((addr) => (
                    <option key={addr.id} value={addr.id}>
                      {addr.label} - {addr.address}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setUseNewAddress(true)}
                  className="text-sm text-primary hover:underline"
                >
                  + Add New Address
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Enter complete delivery address..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none h-24"
                />
                <button
                  type="button"
                  onClick={() => setUseNewAddress(false)}
                  className="text-sm text-neutral-600 hover:text-primary"
                >
                  ← Use Saved Address
                </button>
              </div>
            )}
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Special Instructions
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="E.g., Handle fragile items with care, Call before delivery..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none h-20"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-3">
              Preferred Payment Method
            </label>
            <div className="space-y-2">
              {[
                { value: "credit-terms", label: "Credit Terms (15-30 days)" },
                { value: "neft", label: "NEFT Transfer" },
                { value: "upi", label: "UPI Payment" },
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value={option.value}
                    checked={paymentMethod === option.value}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-neutral-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* GST Invoice */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <input
              type="checkbox"
              id="gst-invoice"
              checked={gstInvoice}
              onChange={(e) => setGstInvoice(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="gst-invoice" className="flex-1 text-sm cursor-pointer">
              <p className="font-medium text-neutral-900">GST Invoice Required</p>
              <p className="text-xs text-neutral-600">GST: {userGST}</p>
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-200 text-neutral-900 rounded-lg hover:bg-slate-300 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || parts.length === 0}
              className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Submit Quote Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
