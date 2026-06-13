"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, MapPin, Plus } from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { useShopAuth } from "@/lib/shopAuthContext";
import { INDIAN_STATES } from "@/lib/shopData";
import {
  saveOrder,
  generateOrderId,
  type ShopOrder,
} from "@/lib/shopOrders";

interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pin: string;
  type: "Home" | "Work" | "Other";
  isDefault?: boolean;
}

const ADDRESSES_KEY = "shop_addresses";

type PaymentMethod = "UPI" | "Card" | "NetBanking" | "COD";

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; hint: string }[] = [
  { id: "UPI", label: "UPI", hint: "Pay using any UPI app" },
  { id: "Card", label: "Credit / Debit Card", hint: "Visa, Mastercard, RuPay" },
  { id: "NetBanking", label: "Net Banking", hint: "All major banks" },
  { id: "COD", label: "Cash on Delivery", hint: "Pay when you receive" },
];

export default function ShopCheckoutPage() {
  const router = useRouter();
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const { user, hydrated } = useShopAuth();

  const [mounted, setMounted] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [placing, setPlacing] = useState(false);
  const placedRef = useRef(false);

  // New-address form
  const [newAddr, setNewAddr] = useState<Address>({
    id: "",
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pin: "",
    type: "Home",
  });

  const [payment, setPayment] = useState<PaymentMethod>("UPI");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(ADDRESSES_KEY);
      const list: Address[] = raw ? JSON.parse(raw) : [];
      setAddresses(list);
      const def = list.find((a) => a.isDefault) ?? list[0];
      if (def) setSelectedAddressId(def.id);
      else setShowNewAddress(true);
    } catch {
      setShowNewAddress(true);
    }
    // Prefill the new-address form from the signed-in user.
    setNewAddr((prev) => ({
      ...prev,
      name: prev.name,
    }));
  }, []);

  // Prefill name/phone from the user once known.
  useEffect(() => {
    if (user) {
      setNewAddr((prev) => ({
        ...prev,
        name: prev.name || user.name,
        phone: prev.phone || user.phone || "",
        city: prev.city || user.city || "",
        state: prev.state || user.state || "",
        pin: prev.pin || user.pincode || "",
      }));
    }
  }, [user]);

  // Empty cart → back to cart (unless we just placed the order).
  useEffect(() => {
    if (mounted && items.length === 0 && !placedRef.current) {
      router.replace("/shop/cart");
    }
  }, [mounted, items.length, router]);

  const selectedAddress = useMemo(
    () => addresses.find((a) => a.id === selectedAddressId),
    [addresses, selectedAddressId]
  );

  if (!mounted || !hydrated) {
    return (
      <div className="container-app py-16 flex justify-center">
        <Loader2 className="animate-spin text-[#EA580C]" size={32} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-app py-16 flex justify-center">
        <Loader2 className="animate-spin text-[#EA580C]" size={32} />
      </div>
    );
  }

  const formatAddress = (a: Address) =>
    `${a.name}, ${[a.line1, a.line2, a.city, a.state, a.pin]
      .filter(Boolean)
      .join(", ")} (${a.phone})`;

  const validate = (): { ok: boolean; address?: Address } => {
    const e: Record<string, string> = {};
    let address: Address | undefined;

    if (showNewAddress || addresses.length === 0) {
      if (!newAddr.name.trim()) e.name = "Required";
      if (!/^[6-9]\d{9}$/.test(newAddr.phone)) e.phone = "Valid 10-digit number";
      if (!newAddr.line1.trim()) e.line1 = "Required";
      if (!newAddr.city.trim()) e.city = "Required";
      if (!newAddr.state) e.state = "Required";
      if (!/^\d{6}$/.test(newAddr.pin)) e.pin = "6-digit PIN";
      if (!e.name && !e.phone && !e.line1 && !e.city && !e.state && !e.pin) {
        address = { ...newAddr, id: Date.now().toString() };
      }
    } else {
      address = selectedAddress;
      if (!address) e.address = "Please select a delivery address";
    }

    if (payment === "UPI" && !/^[\w.\-]+@[\w]+$/.test(upiId)) {
      e.upi = "Enter a valid UPI ID (e.g. name@bank)";
    }
    if (payment === "Card" && !/^\d{16}$/.test(cardNumber.replace(/\s/g, ""))) {
      e.card = "Enter a 16-digit card number";
    }

    setErrors(e);
    return { ok: Object.keys(e).length === 0, address };
  };

  const placeOrder = async () => {
    const { ok, address } = validate();
    if (!ok || !address) return;

    // Persist a freshly added address so it shows up in the profile too.
    if ((showNewAddress || addresses.length === 0) && address) {
      try {
        const next = [
          ...addresses,
          { ...address, isDefault: addresses.length === 0 },
        ];
        localStorage.setItem(ADDRESSES_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
    }

    setPlacing(true);
    await new Promise((r) => setTimeout(r, 800));

    const paymentLabel =
      PAYMENT_OPTIONS.find((p) => p.id === payment)?.label ?? payment;

    const order: ShopOrder = {
      id: generateOrderId(),
      date: new Date().toISOString(),
      status: "Pending",
      items: items.map((it) => ({
        productId: it.productId,
        name: it.name,
        qty: it.qty,
        price: it.price,
        image: it.image,
        category: it.category,
        seller: it.seller,
      })),
      total: totalPrice,
      shippingAddress: formatAddress(address),
      paymentMethod: paymentLabel,
    };

    placedRef.current = true;
    saveOrder(order);
    clearCart();
    router.replace("/shop/checkout/success");
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C] transition-colors ${
      hasError ? "border-red-500 bg-red-50" : "border-neutral-300"
    }`;

  return (
    <div className="container-app py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-6">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: address + payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Address */}
          <section className="card p-6">
            <h2 className="font-bold text-lg text-neutral-900 mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-[#EA580C]" />
              Delivery Address
            </h2>

            {addresses.length > 0 && (
              <div className="space-y-3 mb-4">
                {addresses.map((a) => (
                  <label
                    key={a.id}
                    className={`flex gap-3 p-3 border rounded-lg cursor-pointer ${
                      !showNewAddress && selectedAddressId === a.id
                        ? "border-[#EA580C] bg-orange-50"
                        : "border-neutral-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={!showNewAddress && selectedAddressId === a.id}
                      onChange={() => {
                        setSelectedAddressId(a.id);
                        setShowNewAddress(false);
                        setErrors({});
                      }}
                      className="mt-1 text-[#EA580C]"
                    />
                    <div className="text-sm">
                      <p className="font-semibold text-neutral-900">
                        {a.name}{" "}
                        <span className="text-xs font-normal text-neutral-500">
                          ({a.type})
                        </span>
                      </p>
                      <p className="text-neutral-600">
                        {[a.line1, a.line2, a.city, a.state, a.pin]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                      <p className="text-neutral-500">{a.phone}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {addresses.length > 0 && !showNewAddress && (
              <button
                data-testid="checkout-add-address"
                onClick={() => {
                  setShowNewAddress(true);
                  setErrors({});
                }}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#EA580C] hover:underline"
              >
                <Plus size={15} /> Deliver to a new address
              </button>
            )}

            {(showNewAddress || addresses.length === 0) && (
              <div className="space-y-4 mt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Inp label="Full Name" value={newAddr.name} error={errors.name}
                    onChange={(v) => setNewAddr({ ...newAddr, name: v })} cls={inputClass} />
                  <Inp label="Phone" value={newAddr.phone} error={errors.phone}
                    onChange={(v) => setNewAddr({ ...newAddr, phone: v.replace(/\D/g, "").slice(0, 10) })} cls={inputClass} />
                </div>
                <Inp label="Address Line 1" value={newAddr.line1} error={errors.line1}
                  onChange={(v) => setNewAddr({ ...newAddr, line1: v })} cls={inputClass} />
                <Inp label="Address Line 2 (optional)" value={newAddr.line2 ?? ""}
                  onChange={(v) => setNewAddr({ ...newAddr, line2: v })} cls={inputClass} />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Inp label="City" value={newAddr.city} error={errors.city}
                    onChange={(v) => setNewAddr({ ...newAddr, city: v })} cls={inputClass} />
                  <div>
                    <p className="text-sm font-medium text-neutral-700 mb-2">State</p>
                    <select
                      value={newAddr.state}
                      onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                      className={inputClass(!!errors.state)}
                    >
                      <option value="">Select</option>
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state}</p>}
                  </div>
                  <Inp label="PIN" value={newAddr.pin} error={errors.pin}
                    onChange={(v) => setNewAddr({ ...newAddr, pin: v.replace(/\D/g, "").slice(0, 6) })} cls={inputClass} />
                </div>
                {addresses.length > 0 && (
                  <button
                    onClick={() => {
                      setShowNewAddress(false);
                      setErrors({});
                    }}
                    className="text-sm text-neutral-500 hover:text-neutral-800"
                  >
                    Cancel
                  </button>
                )}
              </div>
            )}
          </section>

          {/* Payment */}
          <section className="card p-6">
            <h2 className="font-bold text-lg text-neutral-900 mb-4">
              Payment Method
            </h2>
            <div className="space-y-3">
              {PAYMENT_OPTIONS.map((p) => (
                <label
                  key={p.id}
                  className={`flex gap-3 p-3 border rounded-lg cursor-pointer ${
                    payment === p.id ? "border-[#EA580C] bg-orange-50" : "border-neutral-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={payment === p.id}
                    onChange={() => {
                      setPayment(p.id);
                      setErrors({});
                    }}
                    className="mt-1 text-[#EA580C]"
                  />
                  <div className="text-sm">
                    <p className="font-semibold text-neutral-900">{p.label}</p>
                    <p className="text-neutral-500">{p.hint}</p>
                  </div>
                </label>
              ))}
            </div>

            {payment === "UPI" && (
              <div className="mt-4">
                <Inp label="UPI ID" value={upiId} error={errors.upi}
                  onChange={setUpiId} cls={inputClass} placeholder="name@bank" />
              </div>
            )}
            {payment === "Card" && (
              <div className="mt-4">
                <Inp label="Card Number" value={cardNumber} error={errors.card}
                  onChange={(v) => setCardNumber(v.replace(/[^\d]/g, "").slice(0, 16))}
                  cls={inputClass} placeholder="1234 5678 9012 3456" />
              </div>
            )}
          </section>
        </div>

        {/* RIGHT: summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-bold text-lg text-neutral-900 mb-4">
              Order Summary
            </h2>
            <div className="space-y-3 mb-4 max-h-64 overflow-auto">
              {items.map((it) => (
                <div key={it.productId} className="flex items-center gap-3 text-sm">
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
            </div>
            <div className="flex justify-between text-sm text-neutral-600 mb-2 border-t border-neutral-200 pt-4">
              <span>Items ({totalItems})</span>
              <span>₹{totalPrice.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm text-neutral-600 mb-4">
              <span>Delivery</span>
              <span className="text-green-600 font-semibold">FREE</span>
            </div>
            <div className="flex justify-between font-bold text-neutral-900 border-t border-neutral-200 pt-4 mb-6">
              <span>Total</span>
              <span data-testid="checkout-total">
                ₹{totalPrice.toLocaleString("en-IN")}
              </span>
            </div>
            <button
              data-testid="checkout-place-order"
              onClick={placeOrder}
              disabled={placing}
              className="w-full py-3 bg-[#EA580C] text-white font-semibold rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {placing && <Loader2 size={18} className="animate-spin" />}
              {placing ? "Placing order..." : "Place Order"}
            </button>
            <Link
              href="/shop/cart"
              className="block text-center text-sm text-[#EA580C] font-semibold mt-4 hover:underline"
            >
              Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Inp({
  label,
  value,
  onChange,
  error,
  cls,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  cls: (hasError: boolean) => string;
  placeholder?: string;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-neutral-700 mb-2">{label}</p>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cls(!!error)}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}
