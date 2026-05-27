"use client";

import { useState } from "react";
import { Download, X } from "lucide-react";
import { Order } from "@/lib/mockOrders";
import { downloadBulkInvoices } from "@/lib/invoiceService";

interface BulkInvoiceDownloadProps {
  orders: Order[];
}

export default function BulkInvoiceDownload({ orders }: BulkInvoiceDownloadProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleSelectOrder = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === orders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(orders.map((o) => o.id));
    }
  };

  const handleDownloadAll = async () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one order");
      return;
    }

    setIsDownloading(true);
    try {
      const orderMap: Record<string, string> = {};
      selectedIds.forEach((id) => {
        const order = orders.find((o) => o.id === id);
        if (order) orderMap[id] = order.orderNumber;
      });

      await downloadBulkInvoices(selectedIds, orderMap);
    } finally {
      setIsDownloading(false);
    }
  };

  if (orders.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-neutral-900">Bulk Invoice Download</h2>
        {selectedIds.length > 0 && (
          <span className="text-sm font-medium text-primary bg-blue-50 px-3 py-1 rounded-full">
            {selectedIds.length} selected
          </span>
        )}
      </div>

      {/* Selection Controls */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleSelectAll}
          className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
        >
          {selectedIds.length === orders.length ? "Deselect All" : "Select All"}
        </button>
        {selectedIds.length > 0 && (
          <button
            onClick={() => setSelectedIds([])}
            className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <X size={16} />
            Clear Selection
          </button>
        )}
      </div>

      {/* Orders List */}
      <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
        {orders.map((order) => (
          <label
            key={order.id}
            className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(order.id)}
              onChange={() => handleSelectOrder(order.id)}
              className="w-4 h-4 cursor-pointer"
            />
            <div className="flex-1">
              <p className="font-medium text-neutral-900">{order.orderNumber}</p>
              <p className="text-sm text-neutral-600">
                {new Date(order.date).toLocaleDateString("en-IN")} • {order.items.length} items
              </p>
            </div>
            <span className="text-sm font-medium text-neutral-900">₹{order.total.toFixed(2)}</span>
          </label>
        ))}
      </div>

      {/* Download Button */}
      {selectedIds.length > 0 && (
        <button
          onClick={handleDownloadAll}
          disabled={isDownloading}
          className="w-full px-6 py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
        >
          <Download size={20} />
          {isDownloading ? "Preparing Download..." : `Download ${selectedIds.length} Invoice${selectedIds.length !== 1 ? "s" : ""} as ZIP`}
        </button>
      )}

      {/* Info */}
      <p className="text-xs text-neutral-600 mt-4">
        💡 Tip: Select multiple orders and download all invoices as a single ZIP file for easy management.
      </p>
    </div>
  );
}
