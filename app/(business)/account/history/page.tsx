"use client";

import Link from "next/link";
import { ArrowRight, TrendingUp, ShoppingCart, Check } from "lucide-react";
import { mockOrders } from "@/lib/mockOrders";

export default function OrderHistoryPage() {
  const totalOrders = mockOrders.length;
  const deliveredOrders = mockOrders.filter((o) => o.status === "delivered").length;
  const totalSpent = mockOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div data-testid="account-history-page" className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-neutral-900">{totalOrders}</p>
            </div>
            <ShoppingCart size={32} className="text-primary opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm mb-1">Delivered</p>
              <p className="text-3xl font-bold text-green-600">{deliveredOrders}</p>
            </div>
            <Check size={32} className="text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm mb-1">Total Spent</p>
              <p className="text-3xl font-bold text-neutral-900">₹{totalSpent.toFixed(0)}</p>
            </div>
            <TrendingUp size={32} className="text-primary opacity-20" />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">Recent Orders</h2>
          <Link
            href="/orders"
            className="flex items-center gap-2 text-primary hover:text-blue-900 font-medium text-sm"
          >
            View All Orders
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">
                  Items
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-neutral-700">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.slice(0, 5).map((order) => {
                const statusColors: Record<string, string> = {
                  pending: "bg-amber-100 text-amber-800",
                  confirmed: "bg-blue-100 text-blue-800",
                  shipped: "bg-purple-100 text-purple-800",
                  delivered: "bg-green-100 text-green-800",
                  cancelled: "bg-red-100 text-red-800",
                  return_initiated: "bg-orange-100 text-orange-800",
                };

                const statusLabels: Record<string, string> = {
                  pending: "Pending",
                  confirmed: "Confirmed",
                  shipped: "Shipped",
                  delivered: "Delivered",
                  cancelled: "Cancelled",
                  return_initiated: "Return Initiated",
                };

                return (
                  <tr key={order.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-neutral-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600">
                      {new Date(order.date).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{order.itemCount} items</td>
                    <td className="px-4 py-3 text-sm font-semibold text-neutral-900 text-right">
                      ₹{order.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          statusColors[order.status]
                        }`}
                      >
                        {statusLabels[order.status]}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Order Status Distribution</h3>
          <div className="space-y-3">
            {[
              {
                label: "Delivered",
                count: mockOrders.filter((o) => o.status === "delivered").length,
                color: "bg-green-500",
              },
              {
                label: "Shipped",
                count: mockOrders.filter((o) => o.status === "shipped").length,
                color: "bg-purple-500",
              },
              {
                label: "Confirmed",
                count: mockOrders.filter((o) => o.status === "confirmed").length,
                color: "bg-blue-500",
              },
              {
                label: "Pending",
                count: mockOrders.filter((o) => o.status === "pending").length,
                color: "bg-amber-500",
              },
              {
                label: "Cancelled",
                count: mockOrders.filter((o) => o.status === "cancelled").length,
                color: "bg-red-500",
              },
            ].map((status) => (
              <div key={status.label} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                <span className="text-sm text-neutral-700 flex-1">{status.label}</span>
                <span className="text-sm font-semibold text-neutral-900">{status.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Top Categories</h3>
          <div className="space-y-3">
            {["Engine Parts", "Brakes", "Filters", "Electrical", "Suspension"].map((cat, i) => (
              <div key={cat} className="flex items-center justify-between">
                <span className="text-sm text-neutral-700">{cat}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${100 - i * 15}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-neutral-700 w-8 text-right">
                    {100 - i * 15}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
