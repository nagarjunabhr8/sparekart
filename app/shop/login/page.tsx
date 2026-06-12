"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, ArrowLeft, Check } from "lucide-react";
import { useShopAuth } from "@/lib/shopAuthContext";

type Tab = "email" | "otp";

// Mock credentials — no backend. B2C only; never touches "b2b_user".
const DEMO_EMAIL = "customer@sparekart.com";
const DEMO_PASSWORD = "Customer@123";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/shop";
  const { user, hydrated, login: shopLogin } = useShopAuth();

  const [activeTab, setActiveTab] = useState<Tab>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  // If already signed in when the page loads, bounce to the shop. The ref
  // guard ensures this only fires for an existing session — not for a fresh
  // login (which redirects to its own target below).
  const didInitCheck = useRef(false);
  useEffect(() => {
    if (!hydrated || didInitCheck.current) return;
    didInitCheck.current = true;
    if (user) router.replace("/shop");
  }, [hydrated, user, router]);

  // ---- Email / Password ----
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (value: string) => {
    if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);
    if (!emailValid || !passwordValid) return;

    setIsLoading(true);
    // Simulate a network round-trip.
    await new Promise((r) => setTimeout(r, 700));

    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      shopLogin({
        name: "Ravi Kumar",
        email: DEMO_EMAIL,
        phone: "9876543210",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500001",
        createdAt: new Date().toISOString(),
      });
      router.replace(redirectTo);
    } else {
      setAuthError("Invalid email or password. Please try again.");
      setIsLoading(false);
    }
  };

  // ---- Mobile OTP ----
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setInterval(() => {
      setResendIn((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendIn]);

  const validatePhone = (value: string) => {
    if (!/^[6-9]\d{9}$/.test(value)) {
      setPhoneError("Enter a valid 10-digit mobile number");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const sendOtp = async () => {
    if (!validatePhone(phone)) return;
    setIsLoading(true);
    setOtpError("");
    await new Promise((r) => setTimeout(r, 600));

    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(code);
    // eslint-disable-next-line no-console
    console.log("OTP:", code);
    setOtpSent(true);
    setOtp(["", "", "", "", "", ""]);
    setResendIn(30);
    setIsLoading(false);
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    setOtpError("");
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setOtpError("Please enter the 6-digit OTP");
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    if (code === generatedOtp) {
      shopLogin({
        name: "Guest User",
        phone,
        createdAt: new Date().toISOString(),
      });
      router.replace("/shop");
    } else {
      setOtpError("Incorrect OTP. Please try again.");
      setIsLoading(false);
    }
  };

  // ---- Forgot password ----
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      setForgotError("Please enter a valid email address");
      return;
    }
    setForgotError("");
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setIsLoading(false);
    setForgotSent(true);
  };

  if (!hydrated || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#EA580C]" size={32} />
      </div>
    );
  }

  const tabBtn = (tab: Tab, label: string) => (
    <button
      data-testid={`shop-login-tab-${tab}`}
      type="button"
      onClick={() => {
        setActiveTab(tab);
        setAuthError("");
      }}
      className={`pb-3 px-4 font-medium text-sm border-b-2 transition-colors ${
        activeTab === tab
          ? "border-[#EA580C] text-[#EA580C]"
          : "border-transparent text-neutral-600 hover:text-neutral-900"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div data-testid="shop-login-page" className="min-h-screen flex">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-[#EA580C] to-[#3730A3] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-300 rounded-full blur-3xl" />
        </div>

        {/* Logo top-left */}
        <div className="relative z-10">
          <span className="text-white font-bold text-2xl">SpareKart</span>
        </div>

        {/* Center content */}
        <div className="relative z-10 text-white">
          <div className="w-16 h-16 bg-[#EA580C] rounded-xl flex items-center justify-center mb-6 shadow-2xl ring-1 ring-white/20">
            <span className="text-white font-bold text-3xl">S</span>
          </div>
          <h1 className="text-[28px] font-bold mb-3">SpareKart</h1>
          <p className="text-lg text-white/90 mb-10 max-w-sm">
            Your trusted source for genuine automobile spare parts
          </p>

          <div className="space-y-5 max-w-sm">
            {[
              { t: "Genuine Parts", d: "OEM verified components" },
              { t: "Fast Delivery", d: "24-48 hours Pan-India" },
              { t: "Easy Returns", d: "30-day hassle-free policy" },
            ].map((f) => (
              <div key={f.t} className="flex gap-4">
                <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Check size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">{f.t}</p>
                  <p className="text-white/80 text-sm">{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10" />
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-3/5 bg-white flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {showForgot ? (
            /* FORGOT PASSWORD PANEL */
            <div data-testid="shop-login-forgot-panel">
              <button
                type="button"
                onClick={() => {
                  setShowForgot(false);
                  setForgotSent(false);
                  setForgotError("");
                }}
                className="flex items-center gap-2 text-sm text-neutral-600 hover:text-[#EA580C] mb-6"
              >
                <ArrowLeft size={16} />
                Back
              </button>

              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Reset Password
              </h2>

              {forgotSent ? (
                <div
                  data-testid="shop-login-forgot-success"
                  className="mt-6"
                >
                  <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 text-sm">
                    ✓ Link sent to {forgotEmail}. Check your inbox.
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgot(false);
                      setForgotSent(false);
                    }}
                    className="mt-4 text-[#EA580C] font-semibold hover:underline text-sm"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgot} className="space-y-4 mt-6">
                  <p className="text-neutral-600 text-sm">
                    Enter your email and we&apos;ll send you a reset link.
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email Address
                    </label>
                    <input
                      data-testid="shop-login-forgot-email"
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => {
                        setForgotEmail(e.target.value);
                        setForgotError("");
                      }}
                      placeholder="you@example.com"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C] transition-colors ${
                        forgotError ? "border-red-500 bg-red-50" : "border-neutral-300"
                      }`}
                    />
                    {forgotError && (
                      <p className="text-red-600 text-sm mt-1">{forgotError}</p>
                    )}
                  </div>
                  <button
                    data-testid="shop-login-forgot-submit"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-[#EA580C] text-white font-semibold rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoading && <Loader2 size={18} className="animate-spin" />}
                    Send Reset Link
                  </button>
                </form>
              )}
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-1">
                  Welcome Back
                </h2>
                <p className="text-neutral-600">Sign in to your account</p>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-6 border-b border-neutral-200">
                {tabBtn("email", "Email Login")}
                {tabBtn("otp", "Mobile OTP")}
              </div>

              {authError && (
                <div
                  data-testid="shop-login-error-banner"
                  className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm"
                >
                  {authError}
                </div>
              )}

              {/* EMAIL TAB */}
              {activeTab === "email" && (
                <form
                  data-testid="shop-login-email-form"
                  onSubmit={handleEmailLogin}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email Address
                    </label>
                    <input
                      data-testid="shop-login-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError("");
                      }}
                      onBlur={() => email && validateEmail(email)}
                      placeholder="you@example.com"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C] transition-colors ${
                        emailError ? "border-red-500 bg-red-50" : "border-neutral-300"
                      }`}
                    />
                    {emailError && (
                      <p data-testid="shop-login-email-error" className="text-red-600 text-sm mt-1">
                        {emailError}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        data-testid="shop-login-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setPasswordError("");
                        }}
                        placeholder="••••••••"
                        className={`w-full px-4 py-3 pr-11 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C] transition-colors ${
                          passwordError ? "border-red-500 bg-red-50" : "border-neutral-300"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-900"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passwordError && (
                      <p data-testid="shop-login-password-error" className="text-red-600 text-sm mt-1">
                        {passwordError}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-neutral-300 text-[#EA580C] focus:ring-[#EA580C]"
                      />
                      <span className="text-sm text-neutral-600">Remember me</span>
                    </label>
                    <button
                      data-testid="shop-login-forgot-link"
                      type="button"
                      onClick={() => setShowForgot(true)}
                      className="text-sm text-[#EA580C] hover:underline font-medium"
                    >
                      Forgot password? →
                    </button>
                  </div>

                  <button
                    data-testid="shop-login-submit"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-[#EA580C] text-white font-semibold rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoading && <Loader2 size={18} className="animate-spin" />}
                    {isLoading ? "Signing in..." : "Sign In"}
                  </button>
                </form>
              )}

              {/* OTP TAB */}
              {activeTab === "otp" && (
                <form
                  data-testid="shop-login-otp-form"
                  onSubmit={verifyOtp}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Mobile Number
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 border border-r-0 border-neutral-300 rounded-l-lg bg-neutral-50 text-neutral-600 text-sm">
                        +91
                      </span>
                      <input
                        data-testid="shop-login-phone"
                        type="tel"
                        inputMode="numeric"
                        value={phone}
                        maxLength={10}
                        onChange={(e) => {
                          setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                          setPhoneError("");
                        }}
                        onBlur={() => phone && validatePhone(phone)}
                        placeholder="9876543210"
                        className={`flex-1 px-4 py-3 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C] transition-colors ${
                          phoneError ? "border-red-500 bg-red-50" : "border-neutral-300"
                        }`}
                      />
                    </div>
                    {phoneError && (
                      <p data-testid="shop-login-phone-error" className="text-red-600 text-sm mt-1">
                        {phoneError}
                      </p>
                    )}
                  </div>

                  {!otpSent ? (
                    <button
                      data-testid="shop-login-send-otp"
                      type="button"
                      onClick={sendOtp}
                      disabled={isLoading}
                      className="w-full py-3 border-2 border-[#EA580C] text-[#EA580C] font-semibold rounded-lg hover:bg-orange-50 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                    >
                      {isLoading && <Loader2 size={18} className="animate-spin" />}
                      {isLoading ? "Sending..." : "Send OTP"}
                    </button>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-3">
                          Enter 6-digit OTP
                        </label>
                        <div className="flex gap-2 justify-between">
                          {otp.map((digit, index) => (
                            <input
                              data-testid={`shop-login-otp-${index}`}
                              key={index}
                              ref={(el) => {
                                otpRefs.current[index] = el;
                              }}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpChange(index, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(index, e)}
                              className="w-12 h-12 text-center text-lg font-bold border-2 border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent transition-colors"
                            />
                          ))}
                        </div>
                        {otpError && (
                          <p data-testid="shop-login-otp-error" className="text-red-600 text-sm mt-2">
                            {otpError}
                          </p>
                        )}
                      </div>

                      <div className="text-sm">
                        {resendIn > 0 ? (
                          <span className="text-neutral-500">
                            Resend in {resendIn}s
                          </span>
                        ) : (
                          <button
                            data-testid="shop-login-resend-otp"
                            type="button"
                            onClick={sendOtp}
                            className="text-[#EA580C] font-medium hover:underline"
                          >
                            Resend OTP
                          </button>
                        )}
                      </div>

                      <button
                        data-testid="shop-login-verify-otp"
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-[#EA580C] text-white font-semibold rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                      >
                        {isLoading && <Loader2 size={18} className="animate-spin" />}
                        {isLoading ? "Verifying..." : "Verify & Sign In"}
                      </button>
                    </>
                  )}
                </form>
              )}

              {/* Demo credentials */}
              <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm font-semibold text-amber-900">
                  Demo Credentials:
                </p>
                <p className="text-xs text-amber-800 mt-2">
                  📧 {DEMO_EMAIL} / {DEMO_PASSWORD}
                </p>
                <p className="text-xs text-amber-800">
                  📱 +91 9876543210 (OTP will be shown in browser console)
                </p>
              </div>

              {/* Footer */}
              <p className="text-center text-sm text-neutral-600 mt-6">
                Don&apos;t have an account?{" "}
                <Link
                  href="/shop/register"
                  className="text-[#EA580C] hover:underline font-semibold"
                >
                  Create Account
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <Loader2 className="animate-spin text-[#EA580C]" size={32} />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
