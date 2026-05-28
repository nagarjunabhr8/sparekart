"use client";

import { useAuthStore } from "@/stores/authStore";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  companyName: string;
  gstNumber: string;
}

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const storeLogin = useAuthStore((state) => state.login);
  const storeLogout = useAuthStore((state) => state.logout);

  const mappedUser: AuthUser | null = user
    ? {
        id: user.userId,
        name: user.businessName || user.email,
        email: user.email,
        companyName: user.businessName || "",
        gstNumber: "",
      }
    : null;

  return {
    user: mappedUser,
    isAuthenticated: isLoggedIn,
    login: (u: AuthUser) =>
      storeLogin({
        userId: u.id,
        email: u.email,
        businessName: u.companyName,
      }),
    logout: storeLogout,
  };
};
