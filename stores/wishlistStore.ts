import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  image: string;
  inStock: boolean;
  stockCount: number;
  compatibility: string;
  rating: number;
  reviews: number;
  discount: number;
  genuine: boolean;
  savedPrice: number;
  addedAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: WishlistItem) => void;
  isWishlisted: (id: string) => boolean;
  getCount: () => number;
  clearWishlist: () => void;
  getItems: () => WishlistItem[];
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item: WishlistItem) => {
        set((state) => {
          const exists = state.items.find((i) => i.id === item.id);
          if (exists) return state;
          return {
            items: [
              ...state.items,
              {
                ...item,
                savedPrice: item.price,
                addedAt: new Date().toISOString(),
              },
            ],
          };
        });
      },

      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      toggleItem: (item: WishlistItem) => {
        const isWishlisted = get().isWishlisted(item.id);
        if (isWishlisted) {
          get().removeItem(item.id);
        } else {
          get().addItem(item);
        }
      },

      isWishlisted: (id: string) => {
        return get().items.some((item) => item.id === id);
      },

      getCount: () => get().items.length,

      clearWishlist: () => {
        set({ items: [] });
      },

      getItems: () => get().items,
    }),
    {
      name: "sparekart-wishlist",
      skipHydration: false,
    }
  )
);
