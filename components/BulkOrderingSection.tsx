"use client";

import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useState } from "react";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export default function BulkOrderingSection() {
  const [items, setItems] = useState<OrderItem[]>([
    {
      id: "1",
      name: "Engine Oil Filter (Bosch)",
      quantity: 50,
      price: 349,
    },
    {
      id: "2",
      name: "Air Filter (Mann)",
      quantity: 30,
      price: 299,
    },
  ]);

  const handleQuantityChange = (id: string, delta: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = totalAmount * 0.15;
  const finalAmount = totalAmount - discount;

  return (
    <section className="bg-neutral-50 py-12 md:py-16 border-b border-neutral-200">
      <div className="container-app">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">
              Sample Bulk Order
            </h2>
            <div className="card divide-y">
              {items.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900">
                      {item.name}
                    </h3>
                    <p className="text-sm text-neutral-500 mt-1">
                      ₹{item.price} per unit
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-neutral-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="p-2 hover:bg-neutral-100"
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        readOnly
                        className="w-12 text-center border-0 focus:ring-0"
                      />
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="p-2 hover:bg-neutral-100"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="w-24 text-right">
                      <p className="font-semibold text-neutral-900">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <h3 className="font-bold text-neutral-900 mb-4">
                Order Summary
              </h3>
              <div className="space-y-3 mb-4 pb-4 border-b border-neutral-200">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-semibold">
                    ₹{totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">
                    Bulk Discount (15%)
                  </span>
                  <span className="font-semibold text-success">
                    -₹{discount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">GST (18%)</span>
                  <span className="font-semibold">
                    ₹{(finalAmount * 0.18).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex justify-between mb-6">
                <span className="font-bold text-neutral-900">Total</span>
                <span className="text-2xl font-bold text-primary">
                  ₹{(finalAmount * 1.18).toLocaleString()}
                </span>
              </div>
              <button className="w-full btn-primary bg-secondary hover:bg-blue-900 flex items-center justify-center gap-2 py-3">
                <ShoppingCart size={18} />
                Proceed to Checkout
              </button>
              <p className="text-xs text-neutral-500 text-center mt-4">
                Includes GST and bulk discount
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
