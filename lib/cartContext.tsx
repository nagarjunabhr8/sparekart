"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
  type ReactNode,
} from "react";

// B2C shopping cart. Kept fully independent from the B2B Zustand cart
// (stores/cartStore.ts, localStorage key "sparekart-cart"). This cart persists
// under its own key so the two portals never share or clobber each other.
const STORAGE_KEY = "sparekart-b2c-cart";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  seller: string;
  category: string;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

type AddPayload = Omit<CartItem, "qty"> & { qty?: number };

type CartAction =
  | { type: "HYDRATE"; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: AddPayload }
  | { type: "REMOVE_ITEM"; payload: { productId: string } }
  | { type: "UPDATE_QTY"; payload: { productId: string; qty: number } }
  | { type: "CLEAR" };

const initialState: CartState = { items: [], totalItems: 0, totalPrice: 0 };

function withTotals(items: CartItem[]): CartState {
  return {
    items,
    totalItems: items.reduce((sum, i) => sum + i.qty, 0),
    totalPrice: items.reduce((sum, i) => sum + i.price * i.qty, 0),
  };
}

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return withTotals(Array.isArray(action.payload) ? action.payload : []);

    case "ADD_ITEM": {
      const qtyToAdd = action.payload.qty ?? 1;
      const existing = state.items.find(
        (i) => i.productId === action.payload.productId
      );
      if (existing) {
        return withTotals(
          state.items.map((i) =>
            i.productId === action.payload.productId
              ? { ...i, qty: i.qty + qtyToAdd }
              : i
          )
        );
      }
      const { qty: _ignored, ...rest } = action.payload;
      return withTotals([...state.items, { ...rest, qty: qtyToAdd }]);
    }

    case "REMOVE_ITEM":
      return withTotals(
        state.items.filter((i) => i.productId !== action.payload.productId)
      );

    case "UPDATE_QTY":
      return withTotals(
        state.items
          .map((i) =>
            i.productId === action.payload.productId
              ? { ...i, qty: action.payload.qty }
              : i
          )
          .filter((i) => i.qty > 0)
      );

    case "CLEAR":
      return initialState;

    default:
      return state;
  }
}

interface CartContextValue extends CartState {
  addItem: (item: AddPayload) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate once from localStorage after mount (avoids SSR/client mismatch).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        dispatch({ type: "HYDRATE", payload: JSON.parse(raw) as CartItem[] });
      }
    } catch {
      // Ignore corrupt/unavailable storage and start with an empty cart.
    }
    setHydrated(true);
  }, []);

  // Persist after hydration so the initial empty state never overwrites
  // a previously saved cart.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // Storage may be full or blocked; cart still works for the session.
    }
  }, [state.items, hydrated]);

  const addItem = useCallback(
    (item: AddPayload) => dispatch({ type: "ADD_ITEM", payload: item }),
    []
  );
  const removeItem = useCallback(
    (productId: string) =>
      dispatch({ type: "REMOVE_ITEM", payload: { productId } }),
    []
  );
  const updateQty = useCallback(
    (productId: string, qty: number) =>
      dispatch({ type: "UPDATE_QTY", payload: { productId, qty } }),
    []
  );
  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);
  const isInCart = useCallback(
    (productId: string) => state.items.some((i) => i.productId === productId),
    [state.items]
  );

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
