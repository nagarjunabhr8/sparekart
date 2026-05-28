"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";

type Tab = "email" | "otp";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggedIn } = useAuthStore();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/b2b");
    }
  }, [isLoggedIn, router]);

  const [activeTab, setActiveTab] = useState<Tab>("email");
  const [isLoading, setIsLoading] = useState(false);

  // Email/Password state
  const [email, setEmail] = useState("demo@sparekart.com");
  const [password, setPassword] = useState("Demo@123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // OTP state
  const [phone, setPhone] = useState("+919876543210");
  const [phoneError, setPhoneError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [demoOTP, setDemoOTP] = useState("");
  const [otpExpiry, setOtpExpiry] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // OTP countdown timer
  useEffect(() => {
    if (otpExpiry <= 0) return;

    const timer = setInterval(() => {
      setOtpExpiry((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [otpExpiry]);

  // Email validation
  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Invalid email format");
      return false;
    }
    setEmailError("");
    return true;
  };

  // Phone validation
  const validatePhone = (value: string) => {
    if (!value) {
      setPhoneError("Phone number is required");
      return false;
    }
    const phoneRegex = /^\+91[0-9]{10}$/;
    if (!phoneRegex.test(value)) {
      setPhoneError("Phone must be +91 followed by 10 digits");
      return false;
    }
    setPhoneError("");
    return true;
  };

  // Handle email login
  const handleEmailLogin = async (e: any) => {
    e.preventDefault();

    const emailValid = validateEmail(email);
    let passwordValid = true;
    if (!password) {
      setPasswordError("Password is required");
      passwordValid = false;
    } else {
      setPasswordError("");
    }

    if (!emailValid || !passwordValid) {
      toast.error("Please fix the errors below");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const msg = data.error || "Login failed";
        toast.error(msg);
        if (data.code === "EMAIL_UNVERIFIED") {
          setEmailError("Email not verified. Please verify your email first.");
        } else if (data.code === "ACCOUNT_SUSPENDED") {
          setEmailError("Account suspended. Contact support.");
        } else if (response.status === 401) {
          setEmailError("Invalid email or password");
          setPasswordError("Invalid email or password");
        }
        return;
      }

      login(data.user);
      toast.success(`Welcome back, ${data.user.businessName || data.user.email}!`);
      router.push("/b2b");
    } catch (error) {
      toast.error("Failed to login. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Send OTP
  const handleSendOTP = async () => {
    if (!validatePhone(phone)) {
      toast.error("Invalid phone number");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to send OTP");
        return;
      }

      setOtpSent(true);
      setDemoOTP(data.demoOTP);
      setOtpExpiry(data.expiresIn);
      toast.success("OTP sent to your phone!");
      setOtp(["", "", "", "", "", ""]);
      // Focus on first OTP input
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (error) {
      toast.error("Failed to send OTP");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    // Auto-focus to next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit on last digit
    if (newOtp[5] && newOtp.every((digit) => digit)) {
      verifyOTP(newOtp);
    }
  };

  // Handle OTP backspace
  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP
  const verifyOTP = async (otpArray: string[]) => {
    const otpCode = otpArray.join("");

    if (otpCode.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp: otpCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Invalid OTP");
        return;
      }

      login(data.user);
      toast.success("Login successful!");
      router.push("/b2b");
    } catch (error) {
      toast.error("Failed to verify OTP");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div data-testid="login-page" className="min-h-screen flex">
        {/* Left Panel - Brand Showcase */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex-col items-center justify-center p-12 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-20 w-96 h-96 bg-orange-400 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 text-center text-white">
            {/* Logo */}
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <span className="text-white font-bold text-4xl">S</span>
            </div>

            <h1 className="text-5xl font-bold mb-4">SpareKart B2B</h1>
            <p className="text-xl text-blue-100 mb-12 max-w-sm mx-auto">
              Your trusted partner for genuine automotive spare parts
            </p>

            {/* Features */}
            <div className="space-y-6 text-left max-w-sm">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-green-400 bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-green-300 text-xl">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-white">Authentic Parts</p>
                  <p className="text-blue-200 text-sm">100% genuine components</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-green-400 bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-green-300 text-xl">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-white">Fast Delivery</p>
                  <p className="text-blue-200 text-sm">Pan-India shipping</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-green-400 bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-green-300 text-xl">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-white">Best Prices</p>
                  <p className="text-blue-200 text-sm">Competitive bulk discounts</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-neutral-600">
                Sign in to your business account
              </p>
            </div>

            {/* Tabs */}
            <div data-testid="login-tabs" className="flex gap-2 mb-8 border-b border-neutral-200">
              <button
                data-testid="login-tab-email"
                onClick={() => {
                  setActiveTab("email");
                  setEmailError("");
                  setPasswordError("");
                  setPhoneError("");
                }}
                className={`pb-3 px-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "email"
                    ? "border-primary text-primary"
                    : "border-transparent text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Email Login
              </button>
              <button
                data-testid="login-tab-otp"
                onClick={() => {
                  setActiveTab("otp");
                  setEmailError("");
                  setPasswordError("");
                  setPhoneError("");
                }}
                className={`pb-3 px-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "otp"
                    ? "border-primary text-primary"
                    : "border-transparent text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Mobile OTP
              </button>
            </div>

            {/* Email Login Tab */}
            {activeTab === "email" && (
              <form
                data-testid="login-email-form"
                onSubmit={handleEmailLogin}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Email Address
                  </label>
                  <input
                    data-testid="login-email-input"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                    onBlur={() => validateEmail(email)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                      emailError
                        ? "border-red-500 bg-red-50"
                        : "border-neutral-300"
                    }`}
                    placeholder="your@company.com"
                  />
                  {emailError && (
                    <p data-testid="login-email-error" className="text-red-600 text-sm mt-1">{emailError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      data-testid="login-password-input"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) setPasswordError("");
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                        passwordError
                          ? "border-red-500 bg-red-50"
                          : "border-neutral-300"
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      data-testid="login-password-toggle"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-900"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {passwordError && (
                    <p data-testid="login-password-error" className="text-red-600 text-sm mt-1">{passwordError}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input
                      data-testid="login-remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-neutral-300 text-primary"
                    />
                    <span className="text-sm text-neutral-600">Remember me</span>
                  </label>
                  <a
                    data-testid="login-forgot-password-link"
                    href="/b2b/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  data-testid="login-submit-button"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue-900 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 size={18} className="animate-spin" />}
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>
              </form>
            )}

            {/* Mobile OTP Tab */}
            {activeTab === "otp" && (
              <div data-testid="login-otp-form" className="space-y-4">
                {!otpSent ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        data-testid="login-phone-input"
                        type="tel"
                        name="phone"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          setPhoneError("");
                        }}
                        onBlur={() => validatePhone(phone)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                          phoneError
                            ? "border-red-500 bg-red-50"
                            : "border-neutral-300"
                        }`}
                        placeholder="+919876543210"
                      />
                      {phoneError && (
                        <p data-testid="login-phone-error" className="text-red-600 text-sm mt-1">
                          {phoneError}
                        </p>
                      )}
                    </div>

                    <button
                      data-testid="login-send-otp-button"
                      onClick={handleSendOTP}
                      disabled={isLoading}
                      className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue-900 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                    >
                      {isLoading && (
                        <Loader2 size={18} className="animate-spin" />
                      )}
                      {isLoading ? "Sending OTP..." : "Send OTP"}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-blue-900">
                        <strong>OTP sent to:</strong> {phone}
                      </p>
                      {otpExpiry > 0 && (
                        <p className="text-sm text-blue-700 mt-2">
                          Expires in: <strong>{otpExpiry}s</strong>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-3">
                        Enter 6-digit OTP
                      </label>
                      <div data-testid="login-otp-input-group" className="flex gap-2 justify-between">
                        {otp.map((digit, index) => (
                          <input
                            data-testid={`login-otp-digit-${index}`}
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
                            className="w-12 h-12 text-center text-lg font-bold border-2 border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                          />
                        ))}
                      </div>
                    </div>

                    {demoOTP && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-900">
                          <strong>Demo OTP:</strong> {demoOTP}
                        </p>
                      </div>
                    )}

                    <button
                      data-testid="login-resend-otp-button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtp(["", "", "", "", "", ""]);
                        setDemoOTP("");
                      }}
                      disabled={isLoading || otpExpiry > 0}
                      className="w-full py-2 text-primary font-medium hover:underline disabled:opacity-50 disabled:text-neutral-400"
                    >
                      {otpExpiry > 0
                        ? `Resend OTP in ${otpExpiry}s`
                        : "Send OTP Again"}
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Demo Info */}
            <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-900">
                <strong>Demo Credentials:</strong>
              </p>
              <p className="text-xs text-amber-800 mt-2">
                📧 demo@sparekart.com / Demo@123
              </p>
              <p className="text-xs text-amber-800">
                📱 +919876543210 (use OTP from response)
              </p>
            </div>

            {/* Footer */}
            <p className="text-center text-sm text-neutral-600 mt-6">
              Don't have an account?{" "}
              <a href="/b2b/register" className="text-primary hover:underline font-semibold">
                Contact Sales
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
