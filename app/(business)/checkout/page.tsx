"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";
import toast, { Toaster } from "react-hot-toast";
import { ChevronLeft, MapPin, CreditCard, Check } from "lucide-react";
import Link from "next/link";

const userPlan: "Professional" | "Enterprise" = "Professional";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    clearCart,
  } = useCartStore();

  const [step, setStep] = useState<"review" | "shipping" | "payment" | "confirm">("review");
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isProcessing, setIsProcessing] = useState(false);

  if (items.length === 0) {
    return (
      <div data-testid="checkout-empty-page" className="min-h-screen bg-slate-50">
        <div className="container-app py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Your cart is empty</h2>
            <p className="text-neutral-600 mb-6">Add items to your cart to proceed with checkout</p>
            <Link
              href="/catalog"
              className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-orange-600"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountRate = userPlan === "Professional" ? 0.15 : 0.25;
  const discount = subtotal * discountRate;
  const afterDiscount = subtotal - discount;
  const gst = afterDiscount * 0.18;
  const delivery = afterDiscount >= 2000 ? 0 : 99;
  const total = afterDiscount + gst + delivery;

  const handlePlaceOrder = async () => {
    if (step === "review") {
      setStep("shipping");
      return;
    }
    if (step === "shipping") {
      if (!shippingAddress.trim()) {
        toast.error("Please enter shipping address");
        return;
      }
      setStep("payment");
      return;
    }
    if (step === "payment") {
      setIsProcessing(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setStep("confirm");
        clearCart();
        toast.success("Order placed successfully!");
        setTimeout(() => {
          router.push("/orders");
        }, 2000);
      } catch (error) {
        toast.error("Failed to place order");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div data-testid="checkout-page" className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="container-app py-6">
            <div className="flex items-center gap-3">
              <Link
                href="/catalog"
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={24} />
              </Link>
              <h1 className="text-3xl font-bold text-neutral-900">Checkout</h1>
            </div>
          </div>
        </div>

        {/* Confirm State */}
        {step === "confirm" && (
          <div className="container-app py-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Check size={32} className="text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-2">Order Confirmed!</h2>
              <p className="text-neutral-600 mb-6">
                Your order has been placed successfully. You'll be redirected to your orders page.
              </p>
            </div>
          </div>
        )}

        {step !== "confirm" && (
          <div className="container-app py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Step Indicators */}
                <div className="flex gap-4 mb-8">
                  {["review", "shipping", "payment"].map((s, i) => (
                    <div key={s} className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          step === s
                            ? "bg-primary text-white"
                            : ["review", "shipping", "payment"].indexOf(step) > i
                            ? "bg-green-600 text-white"
                            : "bg-slate-200 text-neutral-600"
                        }`}
                      >
                        {i + 1}
                      </div>
                      <span className="hidden sm:inline text-sm font-medium text-neutral-700">
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </span>
                      {i < 2 && <div className="hidden lg:block w-8 h-0.5 bg-slate-200"></div>}
                    </div>
                  ))}
                </div>

                {/* Review Step */}
                {step === "review" && (
                  <div className="bg-white rounded-lg border border-slate-200 p-6">
                    <h2 className="text-xl font-bold text-neutral-900 mb-4">Order Review</h2>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center p-3 border border-slate-200 rounded"
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold text-neutral-900">{item.name}</h4>
                            <p className="text-sm text-neutral-600">{item.brand}</p>
                            <p className="text-xs text-neutral-500 mt-1">
                              {item.quantity} × ₹{item.price.toFixed(0)} = ₹
                              {(item.price * item.quantity).toFixed(0)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shipping Step */}
                {step === "shipping" && (
                  <div className="bg-white rounded-lg border border-slate-200 p-6">
                    <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                      <MapPin size={24} />
                      Shipping Address
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Delivery Address
                        </label>
                        <textarea
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          placeholder="Enter your full delivery address..."
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          rows={4}
                        />
                      </div>

                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-900">
                          ℹ️ Delivery will be free since your order is above ₹2000
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Step */}
                {step === "payment" && (
                  <div className="bg-white rounded-lg border border-slate-200 p-6">
                    <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                      <CreditCard size={24} />
                      Payment Method
                    </h2>
                    <div className="space-y-3">
                      {["upi", "neft", "credit"].map((method) => (
                        <label
                          key={method}
                          className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors"
                          style={{
                            borderColor: paymentMethod === method ? "#1E3A8A" : "#E5E7EB",
                            backgroundColor: paymentMethod === method ? "#EFF6FF" : "white",
                          }}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={method}
                            checked={paymentMethod === method}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-4 h-4"
                          />
                          <div>
                            <p className="font-medium text-neutral-900">
                              {method === "upi"
                                ? "UPI"
                                : method === "neft"
                                ? "Bank Transfer (NEFT)"
                                : "Credit Terms"}
                            </p>
                            <p className="text-sm text-neutral-600">
                              {method === "upi"
                                ? "Pay via UPI"
                                : method === "neft"
                                ? "Direct bank transfer"
                                : "30-day credit available"}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg border border-slate-200 p-6 sticky top-20">
                  <h3 className="font-bold text-neutral-900 mb-4">Order Summary</h3>

                  <div className="space-y-3 text-sm mb-4 pb-4 border-b border-slate-200">
                    <div className="flex justify-between text-neutral-700">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600 font-medium">
                        <span>B2B Discount (15%)</span>
                        <span>-₹{discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-neutral-700">
                      <span>GST (18%)</span>
                      <span>₹{gst.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-neutral-700">
                      <span>Delivery</span>
                      <span className={delivery === 0 ? "text-green-600 font-medium" : ""}>
                        {delivery === 0 ? "FREE" : `₹${delivery}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between mb-6 text-lg font-bold text-neutral-900">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-blue-900 disabled:opacity-50 transition-colors"
                  >
                    {isProcessing
                      ? "Processing..."
                      : step === "review"
                      ? "Continue to Shipping"
                      : step === "shipping"
                      ? "Continue to Payment"
                      : "Place Order"}
                  </button>

                  <button
                    onClick={() => window.history.back()}
                    className="w-full mt-2 py-2 border border-slate-300 text-neutral-700 font-medium rounded-lg hover:bg-slate-50"
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
