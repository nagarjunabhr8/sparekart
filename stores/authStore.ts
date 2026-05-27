"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  userId: string;
  email: string;
  businessName?: string;
  phone?: string;
  role?: "admin" | "user";
}

export interface AuthState {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      isLoading: false,

      login: (user: AuthUser) => {
        set({
          user,
          isLoggedIn: true,
        });
      },

      logout: () => {
        set({
          user: null,
          isLoggedIn: false,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: "sparekart-auth",
      storage: typeof window !== "undefined" ? (localStorage as any) : undefined,
    }
  )
);
