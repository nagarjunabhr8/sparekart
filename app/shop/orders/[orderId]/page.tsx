"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  findOrder,
  formatOrderDate,
  STATUS_BADGE,
  type ShopOrder,
} from "@/lib/shopOrders";

export default function ShopOrderDetailPage() {
  const params = useParams<{ orderId: string }>();
  // undefined = loading, null = not found
  const [order, setOrder] = useState<ShopOrder | null | undefined>(undefined);

  useEffect(() => {
    const id = params?.orderId;
    setOrder(id ? (findOrder(id) ?? null) : null);
  }, [params?.orderId]);

  if (order === undefined) {
    return (
      <div className="container-app py-16 flex justify-center">
        <Loader2 className="animate-spin text-[#EA580C]" size={32} />
      </div>
    );
  }

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
        <div className="space-y-4">
          {order.items.map((item, i) => (
            <div
              key={`${item.productId}-${i}`}
              className="flex items-center gap-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-lg object-cover bg-neutral-100 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-neutral-500 uppercase tracking-wide">
                  {item.category}
                </p>
                <p className="font-semibold text-neutral-900">{item.name}</p>
                <p className="text-sm text-neutral-600">
                  Qty {item.qty} · ₹{item.price.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-neutral-500">Sold by {item.seller}</p>
              </div>
              <p className="font-semibold text-neutral-900">
                ₹{(item.price * item.qty).toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>

        {(order.shippingAddress || order.paymentMethod) && (
          <div className="border-t border-neutral-200 mt-6 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {order.shippingAddress && (
              <div>
                <p className="text-neutral-500 mb-1">Delivery address</p>
                <p className="text-neutral-800">{order.shippingAddress}</p>
              </div>
            )}
            {order.paymentMethod && (
              <div>
                <p className="text-neutral-500 mb-1">Payment method</p>
                <p className="text-neutral-800">{order.paymentMethod}</p>
              </div>
            )}
          </div>
        )}

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
