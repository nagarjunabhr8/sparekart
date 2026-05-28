"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Download, Eye, Truck, RotateCcw, Plus } from "lucide-react";
import Link from "next/link";
import { mockOrders, Order, OrderStatus } from "@/lib/mockOrders";
import TrackingModal from "@/components/B2B/TrackingModal";
import ReorderModal from "@/components/B2B/ReorderModal";

const ITEMS_PER_PAGE = 10;

const statusConfig: Record<OrderStatus, { bg: string; text: string; label: string }> = {
  pending: { bg: "bg-amber-100", text: "text-amber-800", label: "Pending" },
  confirmed: { bg: "bg-blue-100", text: "text-blue-800", label: "Confirmed" },
  processing: { bg: "bg-purple-100", text: "text-purple-800", label: "Processing" },
  shipped: { bg: "bg-indigo-100", text: "text-indigo-800", label: "Shipped" },
  out_for_delivery: { bg: "bg-orange-100", text: "text-orange-800", label: "Out for Delivery" },
  delivered: { bg: "bg-green-100", text: "text-green-800", label: "Delivered" },
  cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Cancelled" },
  return_initiated: { bg: "bg-orange-100", text: "text-orange-800", label: "Return Initiated" },
};

export default function OrdersPage() {
  const [filters, setFilters] = useState({
    status: "all" as "all" | OrderStatus,
    search: "",
    startDate: "",
    endDate: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [reorderOpen, setReorderOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    let results = [...mockOrders];

    // Filter by status
    if (filters.status !== "all") {
      results = results.filter((order) => order.status === filters.status);
    }

    // Filter by search (Order ID or item name)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      results = results.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchLower) ||
          order.items.some((item) =>
            item.name.toLowerCase().includes(searchLower)
          )
      );
    }

    // Filter by date range
    if (filters.startDate) {
      results = results.filter((order) => new Date(order.date) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      results = results.filter((order) => new Date(order.date) <= new Date(filters.endDate));
    }

    return results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filters]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const currentOrders = filteredOrders.slice(startIdx, endIdx);

  const getStatusVariants = (status: OrderStatus) => {
    const isActive = ["pending", "confirmed", "processing", "shipped", "out_for_delivery"].includes(status);
    return isActive;
  };

  const handleStatusChange = (status: "all" | OrderStatus) => {
    setFilters({ ...filters, status });
    setCurrentPage(1);
  };

  const handleSearchChange = (search: string) => {
    setFilters({ ...filters, search });
    setCurrentPage(1);
  };

  const handleDownloadInvoice = (order: Order) => {
    // Simulate invoice download
    const link = document.createElement("a");
    link.href = order.invoiceUrl;
    link.download = `${order.orderNumber}-invoice.pdf`;
    link.click();
  };

  return (
    <div data-testid="orders-page" className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container-app py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">My Orders</h1>
            <p data-testid="orders-count" className="text-neutral-600 text-sm mt-1">
              {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <Link
            data-testid="orders-new-order-link"
            href="/b2b/catalog"
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">New Order</span>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div data-testid="orders-filters" className="bg-white border-b border-slate-200 sticky top-16 z-20">
        <div className="container-app py-4 space-y-4">
          {/* Status Tabs */}
          <div data-testid="orders-status-tabs" className="flex flex-wrap gap-2 md:gap-3">
            {[
              { label: "All", value: "all" as const },
              { label: "Active", value: "pending" as const, filterType: "active" },
              { label: "Delivered", value: "delivered" as const },
              { label: "Cancelled", value: "cancelled" as const },
              { label: "Bulk Quotes", value: "confirmed" as const, filterType: "bulk" },
            ].map((tab) => (
              <button
                data-testid={`orders-status-tab-${tab.value}`}
                key={tab.value}
                onClick={() => handleStatusChange(tab.value === "all" ? "all" : (tab.value as OrderStatus))}
                className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                  filters.status === tab.value
                    ? "bg-primary text-white"
                    : "bg-slate-100 text-neutral-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search and Date Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <input
              data-testid="orders-search-input"
              type="text"
              placeholder="Search by Order ID or part name..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <input
              data-testid="orders-start-date"
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <input
              data-testid="orders-end-date"
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
        </div>
      </div>

      {/* Table or Empty State */}
      <div className="container-app py-8">
        {filteredOrders.length === 0 ? (
          <div data-testid="orders-empty-state" className="text-center py-16 bg-white rounded-lg border border-slate-200">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">No orders found</h3>
            <p className="text-neutral-600 max-w-md mx-auto">
              Try adjusting your filters or search criteria.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div data-testid="orders-table" className="hidden md:block bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">
                        Order ID
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">
                        Items
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">
                        Total
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrders.map((order) => (
                      <tr data-testid={`order-row-${order.id}`} data-order-id={order.id} key={order.id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <span className="font-semibold text-neutral-900">{order.orderNumber}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-neutral-600">
                            {new Date(order.date).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <p className="text-neutral-900 font-medium">{order.itemCount} items</p>
                            <p className="text-neutral-600 text-xs mt-1">
                              {order.items.slice(0, 2).map((i) => i.name).join(", ")}
                              {order.items.length > 2 && ` +${order.items.length - 2} more`}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-neutral-900">₹{order.total.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              statusConfig[order.status].bg
                            } ${statusConfig[order.status].text}`}
                          >
                            {statusConfig[order.status].label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-end">
                            <button
                              data-testid={`order-row-download-${order.id}`}
                              onClick={() => handleDownloadInvoice(order)}
                              title="Download Invoice"
                              className="p-2 text-neutral-600 hover:text-primary hover:bg-slate-100 rounded transition-colors"
                            >
                              <Download size={18} />
                            </button>
                            <Link
                              data-testid={`order-row-details-${order.id}`}
                              href={`/b2b/orders/${order.id}`}
                              title="View Details"
                              className="p-2 text-neutral-600 hover:text-primary hover:bg-slate-100 rounded transition-colors"
                            >
                              <Eye size={18} />
                            </Link>
                            {getStatusVariants(order.status) && (
                              <button
                                data-testid={`order-row-track-${order.id}`}
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setTrackingOpen(true);
                                }}
                                title="Track Order"
                                className="p-2 text-neutral-600 hover:text-primary hover:bg-slate-100 rounded transition-colors"
                              >
                                <Truck size={18} />
                              </button>
                            )}
                            <button
                              data-testid={`order-row-reorder-${order.id}`}
                              onClick={() => {
                                setSelectedOrder(order);
                                setReorderOpen(true);
                              }}
                              title="Reorder"
                              className="p-2 text-neutral-600 hover:text-primary hover:bg-slate-100 rounded transition-colors"
                            >
                              <RotateCcw size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div data-testid="orders-mobile-list" className="md:hidden space-y-4">
              {currentOrders.map((order) => (
                <div data-testid={`order-card-${order.id}`} data-order-id={order.id} key={order.id} className="bg-white rounded-lg border border-slate-200 p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-neutral-900">{order.orderNumber}</h3>
                      <p className="text-xs text-neutral-600 mt-1">
                        {new Date(order.date).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusConfig[order.status].bg
                      } ${statusConfig[order.status].text}`}
                    >
                      {statusConfig[order.status].label}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div>
                      <p className="text-xs text-neutral-600">Items</p>
                      <p className="text-sm text-neutral-900">{order.itemCount} items</p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {order.items.slice(0, 2).map((i) => i.name).join(", ")}
                        {order.items.length > 2 && ` +${order.items.length - 2} more`}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-xs text-neutral-600">Subtotal</p>
                        <p className="text-sm font-medium text-neutral-900">₹{order.subtotal.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-600">Discount</p>
                        <p className="text-sm font-medium text-green-600">-₹{order.discount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-600">GST</p>
                        <p className="text-sm font-medium text-neutral-900">₹{order.gst.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-3 mb-4">
                    <p className="text-xs text-neutral-600">Total Amount</p>
                    <p className="text-lg font-bold text-neutral-900">₹{order.total.toFixed(2)}</p>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleDownloadInvoice(order)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-slate-100 text-neutral-700 hover:bg-slate-200 rounded transition-colors"
                    >
                      <Download size={16} />
                      Invoice
                    </button>
                    <Link
                      href={`/b2b/orders/${order.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-slate-100 text-neutral-700 hover:bg-slate-200 rounded transition-colors"
                    >
                      <Eye size={16} />
                      Details
                    </Link>
                    {getStatusVariants(order.status) && (
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setTrackingOpen(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-slate-100 text-neutral-700 hover:bg-slate-200 rounded transition-colors"
                      >
                        <Truck size={16} />
                        Track
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setReorderOpen(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-slate-100 text-neutral-700 hover:bg-slate-200 rounded transition-colors"
                    >
                      <RotateCcw size={16} />
                      Reorder
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-neutral-600">
                  Showing <span className="font-semibold">{startIdx + 1}</span> to{" "}
                  <span className="font-semibold">{Math.min(endIdx, filteredOrders.length)}</span> of{" "}
                  <span className="font-semibold">{filteredOrders.length}</span> orders
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <div className="flex gap-1 items-center">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (page) =>
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1
                      )
                      .map((page, idx, arr) => (
                        <div key={page}>
                          {idx > 0 && arr[idx - 1] !== page - 1 && (
                            <span className="px-2 py-2 text-neutral-600">...</span>
                          )}
                          <button
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 rounded-lg transition-colors ${
                              currentPage === page
                                ? "bg-primary text-white"
                                : "border border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            {page}
                          </button>
                        </div>
                      ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {selectedOrder && (
        <>
          <TrackingModal
            isOpen={trackingOpen}
            onClose={() => setTrackingOpen(false)}
            order={selectedOrder}
          />
          <ReorderModal
            isOpen={reorderOpen}
            onClose={() => setReorderOpen(false)}
            order={selectedOrder}
          />
        </>
      )}
    </div>
  );
}
