"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Search, Copy, Package } from "lucide-react";
import {
  mockShopOrders,
  formatOrderDate,
  STATUS_BADGE,
  type OrderStatus,
  type ShopOrder,
} from "@/lib/shopOrders";
import { useCart } from "@/lib/cartContext";

type StatusTab = "All" | OrderStatus;
type DateRange = "all" | "30d" | "6m" | "1y" | "custom";

const STATUS_TABS: StatusTab[] = [
  "All",
  "Pending",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const TAB_LABEL: Record<StatusTab, string> = {
  All: "All Orders",
  Pending: "Pending",
  Shipped: "Shipped",
  Delivered: "Delivered",
  Cancelled: "Cancelled",
};

export default function ShopOrdersPage() {
  const router = useRouter();
  const { addItem } = useCart();

  // Local copy so "Cancel Order" can mutate status without a backend.
  const [orders, setOrders] = useState<ShopOrder[]>(mockShopOrders);
  const [tab, setTab] = useState<StatusTab>("All");
  const [query, setQuery] = useState("");
  const [range, setRange] = useState<DateRange>("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const filtered = useMemo(() => {
    const now = Date.now();
    const DAY = 24 * 60 * 60 * 1000;

    return orders.filter((o) => {
      // Status tab
      if (tab !== "All" && o.status !== tab) return false;

      // Search by order number or product name
      if (query.trim()) {
        const q = query.toLowerCase();
        const match =
          o.id.toLowerCase().includes(q) ||
          o.product.name.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Date range
      const orderTime = new Date(o.date).getTime();
      if (range === "30d" && now - orderTime > 30 * DAY) return false;
      if (range === "6m" && now - orderTime > 182 * DAY) return false;
      if (range === "1y" && now - orderTime > 365 * DAY) return false;
      if (range === "custom") {
        if (customFrom && orderTime < new Date(customFrom).getTime()) return false;
        if (customTo && orderTime > new Date(customTo).getTime()) return false;
      }

      return true;
    });
  }, [orders, tab, query, range, customFrom, customTo]);

  const copyOrderId = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard?.writeText(`#${id}`).then(
      () => toast.success("Order number copied"),
      () => toast.error("Couldn't copy")
    );
  };

  const cancelOrder = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "Cancelled" } : o))
    );
    toast.success("Order cancelled");
  };

  const reorder = (order: ShopOrder) => {
    addItem({
      productId: order.product.productId,
      name: order.product.name,
      price: order.product.price,
      image: order.product.image,
      seller: order.seller,
      category: order.product.category,
      qty: order.product.qty,
    });
    toast.success("✓ Added to cart");
  };

  const goToDetail = (id: string) => router.push(`/shop/orders/${id}`);

  return (
    <div className="container-app py-8">
      <Toaster position="top-right" />

      <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-6">
        My Orders
      </h1>

      {/* Status tabs */}
      <div className="flex gap-1 border-b border-neutral-200 mb-6 overflow-x-auto">
        {STATUS_TABS.map((t) => (
          <button
            data-testid={`shop-orders-tab-${t.toLowerCase()}`}
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 px-4 font-medium text-sm border-b-2 whitespace-nowrap transition-colors ${
              tab === t
                ? "border-[#EA580C] text-[#EA580C]"
                : "border-transparent text-neutral-600 hover:text-neutral-900"
            }`}
          >
            {TAB_LABEL[t]}
          </button>
        ))}
      </div>

      {/* Search + date filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            data-testid="shop-orders-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by order number or product name"
            className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
          />
        </div>
        <select
          data-testid="shop-orders-date-filter"
          value={range}
          onChange={(e) => setRange(e.target.value as DateRange)}
          className="px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C] text-sm"
        >
          <option value="all">Any time</option>
          <option value="30d">Last 30 days</option>
          <option value="6m">Last 6 months</option>
          <option value="1y">Last year</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {range === "custom" && (
        <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
          <label className="flex items-center gap-2">
            <span className="text-neutral-600">From</span>
            <input
              data-testid="shop-orders-custom-from"
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
            />
          </label>
          <label className="flex items-center gap-2">
            <span className="text-neutral-600">To</span>
            <input
              data-testid="shop-orders-custom-to"
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
            />
          </label>
        </div>
      )}

      {/* Empty state — no orders at all */}
      {orders.length === 0 ? (
        <EmptyState />
      ) : filtered.length === 0 ? (
        <div
          data-testid="shop-orders-no-results"
          className="text-center py-16 text-neutral-500"
        >
          No orders match your filters.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div
              data-testid={`shop-order-card-${order.id}`}
              key={order.id}
              onClick={() => goToDetail(order.id)}
              className="card p-5 cursor-pointer hover:shadow-md transition-shadow"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_BADGE[order.status]}`}
                  >
                    {order.status}
                  </span>
                  <span className="text-sm text-neutral-500">
                    {formatOrderDate(order.date)}
                  </span>
                </div>
                <button
                  data-testid={`shop-order-copy-${order.id}`}
                  onClick={(e) => copyOrderId(e, order.id)}
                  className="flex items-center gap-1.5 text-sm font-medium text-neutral-700 hover:text-[#EA580C]"
                  title="Copy order number"
                >
                  #{order.id}
                  <Copy size={14} />
                </button>
              </div>

              {/* Product */}
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={order.product.image}
                    alt={order.product.name}
                    className="w-16 h-16 rounded-lg object-cover bg-neutral-100 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-neutral-900 truncate">
                      {order.product.name}
                    </p>
                    <p className="text-sm text-neutral-600">
                      Qty {order.product.qty} · ₹{order.product.price.toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-neutral-500">
                      Sold by {order.seller}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-neutral-500">Total</p>
                  <p className="text-lg font-bold text-[#EA580C]">
                    ₹{order.total.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div
                className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-neutral-100"
                onClick={(e) => e.stopPropagation()}
              >
                <OrderActions
                  order={order}
                  onCancel={() => cancelOrder(order.id)}
                  onReorder={() => reorder(order)}
                  onTrack={() => goToDetail(order.id)}
                  onDetails={() => goToDetail(order.id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OrderActions({
  order,
  onCancel,
  onReorder,
  onTrack,
  onDetails,
}: {
  order: ShopOrder;
  onCancel: () => void;
  onReorder: () => void;
  onTrack: () => void;
  onDetails: () => void;
}) {
  const primary =
    "px-4 py-2 text-sm font-semibold rounded-lg bg-[#EA580C] text-white hover:bg-orange-700 transition-colors";
  const outline =
    "px-4 py-2 text-sm font-semibold rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors";
  const danger =
    "px-4 py-2 text-sm font-semibold rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors";

  switch (order.status) {
    case "Pending":
      return (
        <>
          <button data-testid="shop-order-cancel" onClick={onCancel} className={danger}>
            Cancel Order
          </button>
          <button data-testid="shop-order-track" onClick={onTrack} className={primary}>
            Track Order
          </button>
        </>
      );
    case "Shipped":
      return (
        <>
          <button data-testid="shop-order-track" onClick={onTrack} className={primary}>
            Track Order
          </button>
          <button
            data-testid="shop-order-support"
            onClick={() => toast("Support team will reach out shortly")}
            className={outline}
          >
            Contact Support
          </button>
        </>
      );
    case "Delivered":
      return (
        <>
          <button data-testid="shop-order-reorder" onClick={onReorder} className={primary}>
            Reorder
          </button>
          <button
            data-testid="shop-order-review"
            onClick={() => toast("Review submitted — thank you!")}
            className={outline}
          >
            Write Review
          </button>
          <button
            data-testid="shop-order-return"
            onClick={() => toast("Return/refund request started")}
            className={outline}
          >
            Return/Refund
          </button>
        </>
      );
    case "Cancelled":
      return (
        <>
          <button data-testid="shop-order-reorder" onClick={onReorder} className={primary}>
            Reorder
          </button>
          <button data-testid="shop-order-details" onClick={onDetails} className={outline}>
            View Details
          </button>
        </>
      );
  }
}

function EmptyState() {
  return (
    <div data-testid="shop-orders-empty" className="text-center py-16">
      <div className="flex justify-center mb-4 text-neutral-300">
        <Package size={64} />
      </div>
      <h2 className="text-2xl font-bold text-neutral-900 mb-2">No orders yet</h2>
      <p className="text-neutral-600 mb-6">
        When you place an order, it&apos;ll show up here.
      </p>
      <Link
        href="/shop/products"
        className="inline-block btn-primary bg-[#EA580C] hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold"
      >
        Start Shopping →
      </Link>
    </div>
  );
}
