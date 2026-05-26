// Simple auth context for demo purposes
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  companyName: string;
  gstNumber: string;
}

export const useAuth = () => {
  if (typeof window === "undefined") {
    return { user: null, isAuthenticated: false, login: () => {}, logout: () => {} };
  }

  const getUser = (): AuthUser | null => {
    const stored = localStorage.getItem("b2b_user");
    return stored ? JSON.parse(stored) : null;
  };

  const login = (user: AuthUser) => {
    localStorage.setItem("b2b_user", JSON.stringify(user));
  };

  const logout = () => {
    localStorage.removeItem("b2b_user");
  };

  const user = getUser();
  const isAuthenticated = !!user;

  return { user, isAuthenticated, login, logout };
};
