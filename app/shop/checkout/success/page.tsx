"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { getLastOrder, formatOrderDate, type ShopOrder } from "@/lib/shopOrders";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const [order, setOrder] = useState<ShopOrder | null | undefined>(undefined);

  useEffect(() => {
    const last = getLastOrder();
    if (!last) {
      router.replace("/shop");
      return;
    }
    setOrder(last);
  }, [router]);

  if (!order) {
    return (
      <div className="container-app py-16 flex justify-center">
        <Loader2 className="animate-spin text-[#EA580C]" size={32} />
      </div>
    );
  }

  return (
    <div className="container-app py-12 max-w-2xl">
      <style>{`@keyframes ck-pop{0%{transform:scale(0);opacity:0}80%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}`}</style>

      <div className="card p-8 text-center">
        <div
          className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
          style={{ animation: "ck-pop 0.45s ease-out" }}
        >
          <Check size={44} className="text-green-600" strokeWidth={3} />
        </div>

        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          Order placed successfully!
        </h1>
        <p className="text-neutral-600 mb-1">
          Order <span className="font-semibold">#{order.id}</span> ·{" "}
          {formatOrderDate(order.date)}
        </p>
        <p className="text-sm text-neutral-500 mb-6">
          Estimated delivery in 24–48 hours. We&apos;ll keep you posted.
        </p>

        <div className="text-left border border-neutral-200 rounded-lg divide-y divide-neutral-100 mb-6">
          {order.items.map((it, i) => (
            <div
              key={`${it.productId}-${i}`}
              className="flex items-center gap-3 p-3 text-sm"
            >
              <img
                src={it.image}
                alt={it.name}
                className="w-12 h-12 rounded object-cover bg-neutral-100 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-neutral-900 truncate">{it.name}</p>
                <p className="text-neutral-500">Qty {it.qty}</p>
              </div>
              <span className="font-semibold">
                ₹{(it.price * it.qty).toLocaleString("en-IN")}
              </span>
            </div>
          ))}
          <div className="flex justify-between p-3 font-bold text-neutral-900">
            <span>Total</span>
            <span>₹{order.total.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {order.shippingAddress && (
          <p className="text-sm text-neutral-500 mb-6">
            Delivering to: {order.shippingAddress}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/shop/orders"
            className="px-6 py-3 bg-[#EA580C] text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
          >
            View My Orders
          </Link>
          <Link
            href="/shop/products"
            className="px-6 py-3 border border-neutral-300 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
