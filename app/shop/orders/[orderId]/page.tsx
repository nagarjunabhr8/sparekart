"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  getShopOrderById,
  formatOrderDate,
  STATUS_BADGE,
} from "@/lib/shopOrders";

export default function ShopOrderDetailPage() {
  const params = useParams<{ orderId: string }>();
  const order = params?.orderId ? getShopOrderById(params.orderId) : undefined;

  if (!order) {
    return (
      <div className="container-app py-16 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          Order not found
        </h1>
        <p className="text-neutral-600 mb-6">
          We couldn&apos;t find an order with that number.
        </p>
        <Link
          href="/shop/orders"
          className="inline-block btn-primary bg-[#EA580C] hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Back to My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="container-app py-8 max-w-3xl">
      <Link
        href="/shop/orders"
        className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-[#EA580C] mb-6"
      >
        <ArrowLeft size={16} />
        Back to My Orders
      </Link>

      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Order #{order.id}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Placed on {formatOrderDate(order.date)}
          </p>
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_BADGE[order.status]}`}
        >
          {order.status}
        </span>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-4">
          <img
            src={order.product.image}
            alt={order.product.name}
            className="w-20 h-20 rounded-lg object-cover bg-neutral-100 flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="text-xs text-neutral-500 uppercase tracking-wide">
              {order.product.category}
            </p>
            <p className="font-semibold text-neutral-900">{order.product.name}</p>
            <p className="text-sm text-neutral-600">
              Qty {order.product.qty} · ₹
              {order.product.price.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-neutral-500">Sold by {order.seller}</p>
          </div>
        </div>

        <div className="border-t border-neutral-200 mt-6 pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-neutral-600">
            <span>Subtotal</span>
            <span>₹{order.total.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-neutral-600">
            <span>Delivery</span>
            <span className="text-green-600 font-semibold">FREE</span>
          </div>
          <div className="flex justify-between font-bold text-neutral-900 pt-2 border-t border-neutral-100">
            <span>Total</span>
            <span>₹{order.total.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
