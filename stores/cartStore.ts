"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  mrp: number;
  quantity: number;
  image?: string;
  stock: number;
  b2bTierDiscount: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getCartTotal: (tierDiscount?: number) => number;
  getDiscountedPrice: (item: CartItem) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item: CartItem) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            const newQty = Math.min(
              existingItem.quantity + item.quantity,
              item.stock
            );
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: newQty } : i
              ),
            };
          }
          return {
            items: [...state.items, { ...item, quantity: Math.min(item.quantity, item.stock) }],
          };
        });
      },

      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQty: (id: string, quantity: number) => {
        set((state) => {
          const item = state.items.find((i) => i.id === id);
          if (!item) return state;

          const validQty = Math.max(1, Math.min(quantity, item.stock));
          return {
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity: validQty } : i
            ),
          };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getDiscountedPrice: (item: CartItem) => {
        const discount = (item.price * item.b2bTierDiscount) / 100;
        return item.price - discount;
      },

      getCartTotal: () => {
        const state = get();
        return state.items.reduce((sum, item) => {
          const discountedPrice = state.getDiscountedPrice(item);
          return sum + discountedPrice * item.quantity;
        }, 0);
      },
    }),
    {
      name: "sparekart-cart",
      storage: typeof window !== "undefined" ? (localStorage as any) : undefined,
    }
  )
);
