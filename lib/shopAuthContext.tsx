"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// B2C customer auth. Mock/localStorage only — completely separate from the
// B2B auth (stores/authStore.ts, localStorage key "b2b_user"). This never
// reads or writes "b2b_user".
const SHOP_USER_KEY = "shop_user";

export interface ShopUser {
  name: string;
  email?: string;
  phone: string;
  city?: string;
  state?: string;
  pincode?: string;
  vehicles?: string[];
  createdAt: string;
}

interface ShopAuthValue {
  user: ShopUser | null;
  hydrated: boolean;
  isAuthenticated: boolean;
  login: (user: ShopUser) => void;
  logout: () => void;
}

const ShopAuthContext = createContext<ShopAuthValue | null>(null);

export function ShopAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ShopUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SHOP_USER_KEY);
      if (raw) setUser(JSON.parse(raw) as ShopUser);
    } catch {
      // Ignore corrupt/unavailable storage.
    }
    setHydrated(true);

    // Keep state in sync across tabs.
    const onStorage = (e: StorageEvent) => {
      if (e.key !== SHOP_USER_KEY) return;
      try {
        setUser(e.newValue ? (JSON.parse(e.newValue) as ShopUser) : null);
      } catch {
        setUser(null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = useCallback((next: ShopUser) => {
    try {
      localStorage.setItem(SHOP_USER_KEY, JSON.stringify(next));
    } catch {
      /* ignore storage failures */
    }
    setUser(next);
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(SHOP_USER_KEY);
    } catch {
      /* ignore storage failures */
    }
    setUser(null);
  }, []);

  return (
    <ShopAuthContext.Provider
      value={{
        user,
        hydrated,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </ShopAuthContext.Provider>
  );
}

export function useShopAuth(): ShopAuthValue {
  const ctx = useContext(ShopAuthContext);
  if (!ctx) {
    throw new Error("useShopAuth must be used within a ShopAuthProvider");
  }
  return ctx;
}
