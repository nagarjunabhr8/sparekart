"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import toast, { Toaster } from "react-hot-toast";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("admin@techauto.com");
  const [password, setPassword] = useState("demo123456");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Demo login - accept any email/password combo
      if (email && password) {
        login({
          id: "user_123",
          name: "Rajesh Kumar",
          email: email,
          companyName: "TechAuto Services",
          gstNumber: "18AABCU9603R1Z0",
        });

        toast.success("Login successful!");
        router.push("/b2b/account");
      } else {
        toast.error("Please enter email and password");
      }
    } catch (error) {
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      login({
        id: "user_123",
        name: "Rajesh Kumar",
        email: "rajesh@techauto.com",
        companyName: "TechAuto Services",
        gstNumber: "18AABCU9603R1Z0",
      });
      toast.success("Demo login successful!");
      router.push("/b2b/account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-br from-primary to-blue-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-lg shadow-2xl p-8">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-center text-neutral-900 mb-2">
              SpareKart B2B
            </h1>
            <p className="text-center text-neutral-600 mb-8">Sign in to your business account</p>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="your@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-slate-300"
                />
                <label htmlFor="remember" className="text-sm text-neutral-600">
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue-900 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                <LogIn size={18} />
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Demo Login Button */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-neutral-600">or use demo account</span>
              </div>
            </div>

            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white disabled:opacity-50 transition-colors"
            >
              {isLoading ? "Loading..." : "Continue as Demo User"}
            </button>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Demo Account:</strong> Use any email/password combination, or click the demo button to auto-fill credentials.
              </p>
            </div>

            {/* Footer */}
            <p className="text-center text-sm text-neutral-600 mt-6">
              Don't have an account?{" "}
              <a href="#" className="text-primary hover:text-blue-900 font-semibold">
                Contact Sales
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
