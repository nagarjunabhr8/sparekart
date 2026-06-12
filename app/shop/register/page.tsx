"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Check, X } from "lucide-react";
import { useShopAuth } from "@/lib/shopAuthContext";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman & Nicobar", "Chandigarh", "Dadra & Nagar Haveli", "Daman & Diu",
  "Delhi", "Lakshadweep", "Puducherry", "Ladakh", "Jammu & Kashmir",
].sort((a, b) => a.localeCompare(b));

const PINCODE_MAP: Record<string, { city: string; state: string }> = {
  "500001": { city: "Hyderabad", state: "Telangana" },
  "400001": { city: "Mumbai", state: "Maharashtra" },
  "110001": { city: "New Delhi", state: "Delhi" },
  "560001": { city: "Bengaluru", state: "Karnataka" },
  "600001": { city: "Chennai", state: "Tamil Nadu" },
  "700001": { city: "Kolkata", state: "West Bengal" },
  "302001": { city: "Jaipur", state: "Rajasthan" },
  "380001": { city: "Ahmedabad", state: "Gujarat" },
};

const VEHICLE_OPTIONS = ["Car", "Bike", "Truck", "Auto", "SUV"];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ShopRegisterPage() {
  const router = useRouter();
  const { user, hydrated, login: shopLogin } = useShopAuth();

  // Bounce to shop if already signed in (run once after hydration).
  const didInitCheck = useRef(false);
  useEffect(() => {
    if (!hydrated || didInitCheck.current) return;
    didInitCheck.current = true;
    if (user) router.replace("/shop");
  }, [hydrated, user, router]);

  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ---- Step 1 fields ----
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [pincode, setPincode] = useState("");
  const [vehicles, setVehicles] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleVehicle = (v: string) =>
    setVehicles((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    );

  const handlePincode = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 6);
    setPincode(digits);
    setErrors((e) => ({ ...e, pincode: "" }));
    if (digits.length === 6 && PINCODE_MAP[digits]) {
      setCity(PINCODE_MAP[digits].city);
      setStateVal(PINCODE_MAP[digits].state);
      setErrors((e) => ({ ...e, city: "", state: "" }));
    }
  };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!/^[A-Za-z\s]{3,}$/.test(name.trim())) {
      e.name = "Enter at least 3 letters (letters and spaces only)";
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      e.phone = "Enter a valid 10-digit number starting 6-9";
    }
    if (!emailRegex.test(email)) {
      e.email = "Enter a valid email address";
    }
    if (!city.trim()) e.city = "City is required";
    if (!stateVal) e.state = "State is required";
    if (!/^\d{6}$/.test(pincode)) e.pincode = "Enter a 6-digit pincode";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ---- Step 2: OTP ----
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setInterval(
      () => setResendIn((p) => (p <= 1 ? 0 : p - 1)),
      1000
    );
    return () => clearInterval(timer);
  }, [resendIn]);

  const sendOtp = () => {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(code);
    // eslint-disable-next-line no-console
    console.log("OTP:", code);
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setResendIn(30);
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const goToStep2 = () => {
    if (!validateStep1()) return;
    setStep(2);
    sendOtp();
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

  const verifyOtp = () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setOtpError("Please enter the 6-digit OTP");
      return;
    }
    if (code === generatedOtp) {
      setOtpVerified(true);
      setOtpError("");
    } else {
      setOtpError("Incorrect OTP. Please try again.");
    }
  };

  // ---- Step 2: Password ----
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [terms, setTerms] = useState(false);

  const rules = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%]/.test(password),
  };
  const strength = Object.values(rules).filter(Boolean).length;
  const passwordValid = strength === 4;
  const passwordsMatch = confirm.length > 0 && password === confirm;

  const strengthMeta = [
    { label: "", color: "" },
    { label: "Weak", color: "bg-red-500" },
    { label: "Fair", color: "bg-amber-500" },
    { label: "Good", color: "bg-blue-500" },
    { label: "Strong", color: "bg-green-500" },
  ][strength];

  const canSubmit = otpVerified && passwordValid && passwordsMatch && terms;

  const handleCreateAccount = async () => {
    if (!canSubmit) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    shopLogin({
      name: name.trim(),
      email,
      phone,
      city,
      state: stateVal,
      pincode,
      vehicles,
      createdAt: new Date().toISOString(),
    });
    setIsLoading(false);
    setSuccess(true);
  };

  // Auto-redirect 3s after success.
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => router.push("/shop"), 3000);
    return () => clearTimeout(t);
  }, [success, router]);

  const maskedPhone = phone ? `+91 XXXXXX${phone.slice(-4)}` : "+91 XXXXXXXXXX";

  // Show a loader only while checking an *existing* session — not after a
  // fresh sign-up (which sets `user` but should display the success overlay).
  if (!hydrated || (user && !success)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9]">
        <Loader2 className="animate-spin text-[#EA580C]" size={32} />
      </div>
    );
  }

  return (
    <div
      data-testid="shop-register-page"
      className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4 sm:p-8"
    >
      <style>{`@keyframes shop-pop{0%{transform:scale(0);opacity:0}80%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}`}</style>

      <div
        className="w-full bg-white rounded-xl shadow-lg p-8"
        style={{ maxWidth: 600 }}
      >
        {success ? (
          /* ---- SUCCESS ---- */
          <div data-testid="shop-register-success" className="text-center py-6">
            <div
              className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
              style={{ animation: "shop-pop 0.45s ease-out" }}
            >
              <Check size={44} className="text-green-600" strokeWidth={3} />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              🎉 Account Created!
            </h2>
            <p className="text-neutral-700 mb-1">
              Welcome to SpareKart, {name.trim()}!
            </p>
            <p className="text-sm text-neutral-500 mb-6">
              Redirecting to shop in 3 seconds...
            </p>
            <button
              data-testid="shop-register-start-shopping"
              onClick={() => router.push("/shop")}
              className="px-6 py-3 bg-[#EA580C] text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
            >
              Start Shopping →
            </button>
          </div>
        ) : (
          <>
            {/* ---- PROGRESS ---- */}
            <div className="mb-8">
              <p className="text-sm font-medium text-neutral-600 mb-2">
                Step {step} of 2
              </p>
              <div className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden">
                <div
                  data-testid="shop-register-progress"
                  className="h-full bg-[#EA580C] transition-all duration-500"
                  style={{ width: step === 1 ? "50%" : "100%" }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span
                  className={`flex items-center gap-1 font-medium ${
                    step === 1 ? "text-[#EA580C]" : "text-neutral-500"
                  }`}
                >
                  {step > 1 && <Check size={14} />}
                  Personal Info
                </span>
                <span
                  className={`font-medium ${
                    step === 2 ? "text-[#EA580C]" : "text-neutral-500"
                  }`}
                >
                  Verify &amp; Secure
                </span>
              </div>
            </div>

            {/* ---- STEP 1 ---- */}
            {step === 1 && (
              <div data-testid="shop-register-step1">
                <h1 className="text-2xl font-bold text-neutral-900 mb-6">
                  Create Your Account
                </h1>

                <div className="space-y-4">
                  {/* Full name */}
                  <Field label="Full Name" required error={errors.name}>
                    <input
                      data-testid="shop-register-name"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setErrors((er) => ({ ...er, name: "" }));
                      }}
                      placeholder="Your full name"
                      className={inputClass(!!errors.name)}
                    />
                  </Field>

                  {/* Mobile */}
                  <Field label="Mobile Number" required error={errors.phone}>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 border border-r-0 border-neutral-300 rounded-l-lg bg-neutral-100 text-neutral-600 text-sm">
                        +91
                      </span>
                      <input
                        data-testid="shop-register-phone"
                        type="tel"
                        inputMode="numeric"
                        value={phone}
                        maxLength={10}
                        onChange={(e) => {
                          setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                          setErrors((er) => ({ ...er, phone: "" }));
                        }}
                        placeholder="10-digit mobile number"
                        className={`flex-1 px-4 py-3 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C] transition-colors ${
                          errors.phone ? "border-red-500 bg-red-50" : "border-neutral-300"
                        }`}
                      />
                    </div>
                  </Field>

                  {/* Email */}
                  <Field label="Email Address" required error={errors.email}>
                    <input
                      data-testid="shop-register-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors((er) => ({ ...er, email: "" }));
                      }}
                      placeholder="your@email.com"
                      className={inputClass(!!errors.email)}
                    />
                    {!errors.email && emailRegex.test(email) && (
                      <p className="text-green-600 text-sm mt-1">✓ Looks good</p>
                    )}
                  </Field>

                  {/* Pincode (before city/state since it autofills them) */}
                  <Field label="Pincode" required error={errors.pincode}>
                    <input
                      data-testid="shop-register-pincode"
                      type="text"
                      inputMode="numeric"
                      value={pincode}
                      maxLength={6}
                      onChange={(e) => handlePincode(e.target.value)}
                      placeholder="6-digit pincode"
                      className={inputClass(!!errors.pincode)}
                    />
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* City */}
                    <Field label="City" required error={errors.city}>
                      <input
                        data-testid="shop-register-city"
                        type="text"
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                          setErrors((er) => ({ ...er, city: "" }));
                        }}
                        placeholder="Your city"
                        className={inputClass(!!errors.city)}
                      />
                    </Field>

                    {/* State */}
                    <Field label="State" required error={errors.state}>
                      <select
                        data-testid="shop-register-state"
                        value={stateVal}
                        onChange={(e) => {
                          setStateVal(e.target.value);
                          setErrors((er) => ({ ...er, state: "" }));
                        }}
                        className={inputClass(!!errors.state)}
                      >
                        <option value="">Select state</option>
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  {/* Vehicles */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      My Vehicles{" "}
                      <span className="text-neutral-400 font-normal">(optional)</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {VEHICLE_OPTIONS.map((v) => {
                        const selected = vehicles.includes(v);
                        return (
                          <button
                            data-testid={`shop-register-vehicle-${v.toLowerCase()}`}
                            key={v}
                            type="button"
                            onClick={() => toggleVehicle(v)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                              selected
                                ? "bg-[#EA580C] text-white"
                                : "bg-white text-neutral-600 border border-neutral-300 hover:border-neutral-400"
                            }`}
                          >
                            {v}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    disabled
                    className="px-6 py-3 border border-neutral-300 text-neutral-400 rounded-lg cursor-not-allowed font-medium"
                  >
                    Back
                  </button>
                  <button
                    data-testid="shop-register-next"
                    type="button"
                    onClick={goToStep2}
                    className="px-6 py-3 bg-[#EA580C] text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* ---- STEP 2 ---- */}
            {step === 2 && (
              <div data-testid="shop-register-step2">
                <h1 className="text-2xl font-bold text-neutral-900 mb-6">
                  Verify Your Account
                </h1>

                {/* Section A: OTP */}
                <div className="mb-6">
                  <p className="text-sm text-neutral-600 mb-3">
                    OTP sent to{" "}
                    <span className="font-semibold text-neutral-900">
                      {maskedPhone}
                    </span>
                  </p>
                  <div className="flex gap-2 justify-between mb-3">
                    {otp.map((digit, index) => (
                      <input
                        data-testid={`shop-register-otp-${index}`}
                        key={index}
                        ref={(el) => {
                          otpRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        disabled={otpVerified}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-12 text-center text-lg font-bold border-2 border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent disabled:bg-green-50 disabled:border-green-300 transition-colors"
                      />
                    ))}
                  </div>

                  {otpError && (
                    <p data-testid="shop-register-otp-error" className="text-red-600 text-sm mb-2">
                      {otpError}
                    </p>
                  )}

                  {otpVerified ? (
                    <p data-testid="shop-register-otp-verified" className="text-green-600 text-sm font-medium flex items-center gap-1">
                      <Check size={16} /> Mobile number verified
                    </p>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        {resendIn > 0 ? (
                          <span className="text-neutral-500">
                            Resend in {resendIn}s
                          </span>
                        ) : (
                          <button
                            data-testid="shop-register-resend-otp"
                            type="button"
                            onClick={sendOtp}
                            className="text-[#EA580C] font-medium hover:underline"
                          >
                            Resend OTP
                          </button>
                        )}
                      </div>
                      <button
                        data-testid="shop-register-verify-otp"
                        type="button"
                        onClick={verifyOtp}
                        className="px-4 py-2 border-2 border-[#EA580C] text-[#EA580C] font-semibold rounded-lg hover:bg-orange-50 transition-colors"
                      >
                        Verify OTP
                      </button>
                    </div>
                  )}
                </div>

                {/* Section B: Password (after OTP verified) */}
                {otpVerified && (
                  <div
                    data-testid="shop-register-password-section"
                    className="space-y-4 border-t border-neutral-200 pt-6"
                    style={{ animation: "shop-pop 0.4s ease-out" }}
                  >
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          data-testid="shop-register-password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create a password"
                          className="w-full px-4 py-3 pr-11 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C] transition-colors"
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

                      {/* Strength meter */}
                      {password.length > 0 && (
                        <div className="mt-2">
                          <div className="flex gap-1">
                            {[0, 1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className={`h-1.5 flex-1 rounded-full ${
                                  i < strength ? strengthMeta.color : "bg-neutral-200"
                                }`}
                              />
                            ))}
                          </div>
                          {strengthMeta.label && (
                            <p className="text-xs text-neutral-600 mt-1">
                              {strengthMeta.label}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Rules checklist */}
                      <ul className="mt-3 space-y-1 text-sm">
                        <Rule ok={rules.length}>At least 8 characters</Rule>
                        <Rule ok={rules.upper}>One uppercase letter (A-Z)</Rule>
                        <Rule ok={rules.number}>One number (0-9)</Rule>
                        <Rule ok={rules.special}>One special character (!@#$%)</Rule>
                      </ul>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          data-testid="shop-register-confirm"
                          type={showConfirm ? "text" : "password"}
                          value={confirm}
                          onChange={(e) => setConfirm(e.target.value)}
                          placeholder="Re-enter your password"
                          className="w-full px-4 py-3 pr-11 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C] transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((s) => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-900"
                          aria-label={showConfirm ? "Hide password" : "Show password"}
                        >
                          {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {confirm.length > 0 && (
                        <p
                          className={`text-sm mt-1 ${
                            passwordsMatch ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {passwordsMatch
                            ? "✓ Passwords match"
                            : "✗ Passwords do not match"}
                        </p>
                      )}
                    </div>

                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        data-testid="shop-register-terms"
                        type="checkbox"
                        checked={terms}
                        onChange={(e) => setTerms(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded border-neutral-300 text-[#EA580C] focus:ring-[#EA580C]"
                      />
                      <span className="text-sm text-neutral-600">
                        I agree to the{" "}
                        <a
                          href="/terms"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#EA580C] hover:underline"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#EA580C] hover:underline"
                        >
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex justify-between items-center gap-4 mt-8">
                  <button
                    data-testid="shop-register-back"
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors font-medium"
                  >
                    Back
                  </button>
                  <button
                    data-testid="shop-register-submit"
                    type="button"
                    onClick={handleCreateAccount}
                    disabled={!canSubmit || isLoading}
                    className="flex-1 py-3 bg-[#EA580C] text-white font-semibold rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoading && <Loader2 size={18} className="animate-spin" />}
                    Create Account
                  </button>
                </div>
              </div>
            )}

            {/* Bottom link */}
            <p className="text-center text-sm text-neutral-600 mt-6">
              Already have an account?{" "}
              <Link
                href="/shop/login"
                className="text-[#EA580C] hover:underline font-semibold"
              >
                Sign In
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ---- Small presentational helpers ----
function inputClass(hasError: boolean) {
  return `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA580C] transition-colors ${
    hasError ? "border-red-500 bg-red-50" : "border-neutral-300"
  }`;
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}

function Rule({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li
      className={`flex items-center gap-2 ${
        ok ? "text-green-600" : "text-neutral-500"
      }`}
    >
      {ok ? <Check size={14} /> : <X size={14} className="text-neutral-400" />}
      {children}
    </li>
  );
}
