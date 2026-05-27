"use client";

import { X, ShoppingCart, AlertCircle, AlertTriangle, TrendingDown, Check, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Order, OrderItem } from "@/lib/mockOrders";
import { useCartStore } from "@/stores/cartStore";
import toast from "react-hot-toast";
import { analytics } from "@/lib/analytics";

interface ReorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

interface StockInfo {
  partId: string;
  name: string;
  brand: string;
  currentPrice: number;
  originalPrice: number;
  inStock: boolean;
  stockCount: number;
}

interface ReorderItem extends OrderItem {
  currentQty: number;
  stockInfo?: StockInfo;
  priceChanged: boolean;
}

export default function ReorderModal({ isOpen, onClose, order }: ReorderModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState<ReorderItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const cartStore = useCartStore();

  // Initialize items on mount
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIsLoading(true);
      checkStock();
    }
  }, [isOpen]);

  const checkStock = async () => {
    try {
      const partIds = order.items.map((item) => item.id);
      const response = await fetch("/api/parts/batch-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partIds }),
      });

      if (!response.ok) throw new Error("Stock check failed");

      const data: { items: StockInfo[] } = await response.json();
      const stockMap = new Map(data.items.map((item: StockInfo) => [item.partId, item]));

      const reorderItems: ReorderItem[] = order.items.map((item) => {
        const stock = stockMap.get(item.id);
        return {
          ...item,
          currentQty: item.quantity,
          stockInfo: stock,
          priceChanged: !!(stock && stock.currentPrice !== item.price),
        } as ReorderItem;
      });

      setItems(reorderItems);
      setSelectedItems(new Set(order.items.map((i) => i.id)));
    } catch (error) {
      console.error("Stock check error:", error);
      toast.error("Failed to check stock availability");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleItem = (itemId: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(itemId)) {
      newSelection.delete(itemId);
    } else {
      newSelection.add(itemId);
    }
    setSelectedItems(newSelection);
  };

  const updateQty = (itemId: string, qty: number) => {
    const item = items.find((i) => i.id === itemId);
    if (!item || !item.stockInfo) return;

    const maxQty = Math.min(item.stockInfo.stockCount, item.quantity);
    const validQty = Math.max(1, Math.min(qty, maxQty));

    setItems(
      items.map((i) => (i.id === itemId ? { ...i, currentQty: validQty } : i))
    );
  };

  const handleAddToCart = async () => {
    if (selectedItems.size === 0) {
      toast.error("Please select at least one item");
      return;
    }

    setIsSubmitting(true);

    try {
      const itemsToAdd = items
        .filter((item) => selectedItems.has(item.id) && item.stockInfo?.inStock)
        .map((item) => ({
          id: item.id,
          name: item.name,
          brand: item.brand,
          price: item.stockInfo?.currentPrice || item.price,
          mrp: item.stockInfo?.originalPrice || item.price,
          quantity: item.currentQty,
          stock: item.stockInfo?.stockCount || 0,
          b2bTierDiscount: 15,
        }));

      const skippedCount = selectedItems.size - itemsToAdd.length;

      // Add items to cart
      itemsToAdd.forEach((cartItem) => {
        cartStore.addItem(cartItem);
      });

      // Track analytics
      analytics.track("reorder_initiated", {
        orderId: order.id,
        orderNumber: order.orderNumber,
        itemCount: itemsToAdd.length,
        skippedCount,
        totalAmount: order.total,
      });

      // Show success toast
      let toastMessage = `${itemsToAdd.length} item${itemsToAdd.length !== 1 ? "s" : ""} added to cart`;
      if (skippedCount > 0) {
        toastMessage += `, ${skippedCount} out of stock item${skippedCount !== 1 ? "s" : ""} skipped`;
      }
      toast.success(toastMessage);

      onClose();
    } catch (error) {
      console.error("Reorder error:", error);
      toast.error("Failed to add items to cart");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const outOfStockCount = items.filter(
    (item) => selectedItems.has(item.id) && !item.stockInfo?.inStock
  ).length;

  const priceChangedCount = items.filter(
    (item) => selectedItems.has(item.id) && item.priceChanged
  ).length;

  const selectedItemsData = items.filter((item) => selectedItems.has(item.id));
  const newTotal = selectedItemsData.reduce(
    (sum, item) => sum + (item.stockInfo?.currentPrice || item.price) * item.currentQty,
    0
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Reorder from {order.orderNumber}</h2>
            <p className="text-xs text-neutral-600 mt-1">Step {step} of 3</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-neutral-600 mt-4">Checking stock availability...</p>
            </div>
          ) : step === 1 ? (
            // Step 1: Select Items
            <div className="space-y-4">
              <p className="text-sm text-neutral-600">
                Select items to reorder. Out-of-stock items are highlighted.
              </p>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {items.map((item) => {
                  const isSelected = selectedItems.has(item.id);
                  const isOutOfStock = !item.stockInfo?.inStock;

                  return (
                    <label
                      key={item.id}
                      className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        isOutOfStock
                          ? "bg-red-50 border-red-200 opacity-75"
                          : isSelected
                            ? "bg-blue-50 border-blue-300"
                            : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleItem(item.id)}
                        disabled={isOutOfStock}
                        className="w-4 h-4 mt-1 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-neutral-900">{item.name}</p>
                            <p className="text-xs text-neutral-600">{item.brand}</p>
                          </div>
                          {isOutOfStock && (
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded whitespace-nowrap">
                              Out of Stock
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <div>
                            <p className="text-neutral-600">Previously ordered</p>
                            <p className="font-medium text-neutral-900">{item.quantity} units</p>
                          </div>
                          <div>
                            <p className="text-neutral-600">Price</p>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-neutral-900">₹{item.stockInfo?.currentPrice || item.price}</p>
                              {item.priceChanged && (
                                <span className="text-amber-600 text-xs flex items-center gap-1">
                                  <TrendingDown size={12} />
                                  Was ₹{item.price}
                                </span>
                              )}
                            </div>
                          </div>
                          {item.stockInfo?.inStock && (
                            <div>
                              <p className="text-neutral-600">Available</p>
                              <p className="font-medium text-green-600">{item.stockInfo.stockCount} units</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>

              {outOfStockCount > 0 && (
                <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-900">
                    {outOfStockCount} item{outOfStockCount !== 1 ? "s" : ""} out of stock and will be skipped
                  </p>
                </div>
              )}

              {priceChangedCount > 0 && (
                <div className="flex gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-900">
                    {priceChangedCount} item{priceChangedCount !== 1 ? "s" : ""} ha{priceChangedCount !== 1 ? "ve" : "s"} price updates
                  </p>
                </div>
              )}
            </div>
          ) : step === 2 ? (
            // Step 2: Adjust Quantities
            <div className="space-y-4">
              <p className="text-sm text-neutral-600">
                Adjust quantities as needed. Items are limited by available stock.
              </p>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedItemsData
                  .filter((item) => item.stockInfo?.inStock)
                  .map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-neutral-900">{item.name}</p>
                        <p className="text-xs text-neutral-600 mt-1">
                          Stock: {item.stockInfo?.stockCount} units
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQty(item.id, item.currentQty - 1)}
                          className="px-2 py-1 border border-slate-300 rounded hover:bg-slate-100 text-neutral-600"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={item.currentQty}
                          onChange={(e) => updateQty(item.id, parseInt(e.target.value) || 1)}
                          className="w-12 px-2 py-1 border border-slate-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                          onClick={() => updateQty(item.id, item.currentQty + 1)}
                          className="px-2 py-1 border border-slate-300 rounded hover:bg-slate-100 text-neutral-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            // Step 3: Confirmation
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                <Check size={20} className="text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-900">Ready to add to cart</p>
                  <p className="text-sm text-green-800 mt-1">
                    {selectedItemsData.filter((i) => i.stockInfo?.inStock).length} item
                    {selectedItemsData.filter((i) => i.stockInfo?.inStock).length !== 1 ? "s" : ""} will be
                    added
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-neutral-900">Order Summary</h3>
                {selectedItemsData
                  .filter((i) => i.stockInfo?.inStock)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm border-b border-slate-200 pb-2"
                    >
                      <div>
                        <p className="text-neutral-900 font-medium">{item.name}</p>
                        <p className="text-neutral-600">
                          {item.currentQty} × ₹{item.stockInfo?.currentPrice || item.price}
                        </p>
                      </div>
                      <p className="font-medium text-neutral-900">
                        ₹{((item.stockInfo?.currentPrice || item.price) * item.currentQty).toFixed(2)}
                      </p>
                    </div>
                  ))}

                <div className="flex items-center justify-between font-semibold text-base pt-2 border-t border-slate-200">
                  <span>New Total</span>
                  <span className="text-primary">₹{newTotal.toFixed(2)}</span>
                </div>
              </div>

              {outOfStockCount > 0 && (
                <div className="flex gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-900">
                    {outOfStockCount} out of stock item{outOfStockCount !== 1 ? "s were" : " was"} excluded
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4 flex gap-3 sticky bottom-0 bg-white">
          <button
            onClick={() => {
              if (step === 1) onClose();
              else setStep((Math.max(1, step - 1)) as 1 | 2 | 3);
            }}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>

          {step < 3 ? (
            <button
              onClick={() => {
                if (step === 1 && selectedItems.size === 0) {
                  toast.error("Please select at least one item");
                  return;
                }
                setStep((Math.min(3, step + 1)) as 1 | 2 | 3);
              }}
              className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              Next
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} />
              {isSubmitting ? "Adding..." : "Add to Cart"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
