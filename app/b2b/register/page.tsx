"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";
import {
  ChevronRight,
  Loader2,
  Check,
} from "lucide-react";

// Validation schemas
const businessInfoSchema = z.object({
  businessName: z.string().min(3, "Business name must be at least 3 characters"),
  gstNumber: z
    .string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST format"),
  businessType: z.enum(
    ["workshop", "fleet", "dealer", "garage_chain", "mechanic"],
    { message: "Please select a business type" }
  ),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  yearsInBusiness: z.string().optional(),
});

const contactSecuritySchema = z.object({
  ownerName: z.string().min(2, "Name must be at least 2 characters"),
  mobile: z.string().regex(/^\+91[0-9]{10}$/, "Invalid phone number"),
  otpVerified: z.boolean().refine((val) => val === true, "Phone must be verified"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const planSelectionSchema = z.object({
  selectedPlan: z.enum(["starter", "professional", "enterprise"]),
  estimatedSpend: z.string().optional(),
});

type BusinessInfoForm = z.infer<typeof businessInfoSchema>;
type ContactSecurityForm = z.infer<typeof contactSecuritySchema>;
type PlanSelectionForm = z.infer<typeof planSelectionSchema>;

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "Free",
    description: "Perfect to get started",
    features: [
      "Up to 50 orders/month",
      "Basic inventory management",
      "Email support",
      "Standard payment terms",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: "₹4,999",
    period: "/month",
    description: "Most popular for growing businesses",
    features: [
      "Unlimited orders",
      "Advanced analytics",
      "Priority support",
      "15-30 days credit terms",
      "Dedicated account manager",
    ],
    badge: "Popular",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    description: "For large-scale operations",
    features: [
      "Custom solutions",
      "API access",
      "White-label options",
      "Extended credit terms",
      "24/7 dedicated support",
    ],
  },
];

const BUSINESS_TYPES = [
  { value: "workshop", label: "Workshop / Service Center" },
  { value: "fleet", label: "Fleet Operator" },
  { value: "dealer", label: "Spare Parts Dealer" },
  { value: "garage_chain", label: "Garage Chain" },
  { value: "mechanic", label: "Individual Mechanic" },
];

interface PincodeData {
  city: string;
  state: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessInfo: {} as BusinessInfoForm,
    contactSecurity: {} as ContactSecurityForm,
    planSelection: { selectedPlan: "starter" } as PlanSelectionForm,
  });

  // Step 1: Business Info
  const businessForm = useForm<BusinessInfoForm>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: {
      businessName: "",
      gstNumber: "",
      businessType: undefined,
      city: "",
      state: "",
      pincode: "",
      yearsInBusiness: undefined,
    },
  });

  // Step 2: Contact & Security
  const contactForm = useForm<ContactSecurityForm>({
    resolver: zodResolver(contactSecuritySchema),
    defaultValues: {
      ownerName: "",
      mobile: "+91",
      otpVerified: false,
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Step 3: Plan Selection
  const planForm = useForm<PlanSelectionForm>({
    resolver: zodResolver(planSelectionSchema),
    defaultValues: {
      selectedPlan: "starter",
      estimatedSpend: undefined,
    },
  });

  // Pincode lookup
  const handlePincodeChange = async (pincode: string) => {
    businessForm.setValue("pincode", pincode);

    if (pincode.length === 6) {
      try {
        setIsLoading(true);
        // Mock pincode lookup - in production, use real API
        const mockData: Record<string, PincodeData> = {
          "560001": { city: "Bangalore", state: "Karnataka" },
          "400001": { city: "Mumbai", state: "Maharashtra" },
          "110001": { city: "New Delhi", state: "Delhi" },
          "600001": { city: "Chennai", state: "Tamil Nadu" },
          "700001": { city: "Kolkata", state: "West Bengal" },
        };

        const data = mockData[pincode];
        if (data) {
          businessForm.setValue("city", data.city);
          businessForm.setValue("state", data.state);
          toast.success("Location auto-filled");
        } else {
          businessForm.setValue("city", "");
          businessForm.setValue("state", "");
          toast.error("Pincode not found");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Real-time GST validation
  const validateGST = async (gst: string) => {
    if (gst.length === 15) {
      try {
        // Mock GST validation - in production, use real GST API
        const isValid = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
          gst
        );

        if (!isValid) {
          businessForm.setError("gstNumber", {
            message: "Invalid GST format",
          });
        } else {
          // Check for duplicate GST
          try {
            const response = await fetch(
              `/api/b2b/check-gst?gst=${encodeURIComponent(gst)}`
            );
            const data = await response.json();

            if (!data.available) {
              businessForm.setError("gstNumber", {
                message: "GST already registered",
              });
            } else {
              businessForm.clearErrors("gstNumber");
            }
          } catch (error) {
            console.error("GST check error:", error);
          }
        }
      } catch (error) {
        console.error("GST validation error:", error);
      }
    }
  };

  // Real-time email validation
  const validateEmail = async (email: string) => {
    if (email.includes("@")) {
      try {
        const response = await fetch(
          `/api/b2b/check-email?email=${encodeURIComponent(email)}`
        );
        const data = await response.json();

        if (!data.available) {
          contactForm.setError("email", {
            message: "Email already registered",
          });
        } else {
          contactForm.clearErrors("email");
        }
      } catch (error) {
        console.error("Email check error:", error);
      }
    }
  };

  // OTP state and handling
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [demoOTP, setDemoOTP] = useState("");
  const [otpExpiry, setOtpExpiry] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // OTP countdown
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

  const handleSendOTP = async () => {
    const mobile = contactForm.getValues("mobile");

    if (!mobile || !/^\+91[0-9]{10}$/.test(mobile)) {
      toast.error("Enter valid phone number");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: mobile }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to send OTP");
        return;
      }

      setOtpSent(true);
      setDemoOTP(data.demoOTP);
      setOtpExpiry(data.expiresIn);
      setOtp(["", "", "", "", "", ""]);
      toast.success("OTP sent!");

      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (error) {
      toast.error("Failed to send OTP");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    if (newOtp[5] && newOtp.every((digit) => digit)) {
      verifyOTP(newOtp);
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const verifyOTP = async (otpArray: string[]) => {
    const otpCode = otpArray.join("");

    if (otpCode.length !== 6) {
      toast.error("Enter 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      // Mock OTP verification - in production, use real API
      const isValid = otpCode === demoOTP || otpCode === "123456";

      if (isValid) {
        contactForm.setValue("otpVerified", true);
        setOtpSent(false);
        toast.success("Phone verified!");
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      toast.error("Failed to verify OTP");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength meter
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    return { strength, label: ["Weak", "Fair", "Good", "Strong", "Very Strong"][strength] };
  };

  const passwordStrength = getPasswordStrength(contactForm.watch("password"));

  // Handle step progression
  const handleNextStep = async () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = await businessForm.trigger();
      if (isValid) {
        setFormData((prev) => ({
          ...prev,
          businessInfo: businessForm.getValues(),
        }));
        setCurrentStep(2);
        window.scrollTo(0, 0);
      }
    } else if (currentStep === 2) {
      isValid = await contactForm.trigger();
      if (isValid) {
        setFormData((prev) => ({
          ...prev,
          contactSecurity: contactForm.getValues(),
        }));
        setCurrentStep(3);
        window.scrollTo(0, 0);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Handle final registration submission
  const handleSubmit = async () => {
    const isValid = await planForm.trigger();

    if (!isValid) {
      toast.error("Please complete all fields");
      return;
    }

    setIsLoading(true);
    try {
      const registrationData = {
        ...formData.businessInfo,
        ...formData.contactSecurity,
        ...formData.planSelection,
      };

      const response = await fetch("/api/b2b/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Registration failed");
        return;
      }

      toast.success("Registration successful! Welcome to SpareKart!");

      // Redirect to onboarding
      setTimeout(() => {
        router.push("/b2b/account/onboarding");
      }, 1000);
    } catch (error) {
      toast.error("Failed to register. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-neutral-50 py-12 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Register Your Business
            </h1>
            <p className="text-neutral-600">
              Join SpareKart's B2B network and grow your business
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1">
                <div className="text-sm font-medium text-neutral-900">
                  Step {currentStep} of 3
                </div>
              </div>
            </div>
            <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-4">
              {["Business Info", "Contact & Security", "Plan Selection"].map(
                (label, idx) => (
                  <div
                    key={idx}
                    className={`text-xs font-medium ${
                      idx + 1 <= currentStep
                        ? "text-primary"
                        : "text-neutral-500"
                    }`}
                  >
                    {label}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Form container */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Step 1: Business Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-neutral-900">
                  Business Information
                </h2>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    {...businessForm.register("businessName")}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your business name"
                  />
                  {businessForm.formState.errors.businessName && (
                    <p className="text-red-600 text-sm mt-1">
                      {businessForm.formState.errors.businessName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    GST Number *
                  </label>
                  <input
                    type="text"
                    {...businessForm.register("gstNumber")}
                    onChange={(e) => {
                      businessForm.setValue("gstNumber", e.target.value.toUpperCase());
                      if (e.target.value.length === 15) {
                        validateGST(e.target.value);
                      }
                    }}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary uppercase"
                    placeholder="15-character GST number"
                    maxLength={15}
                  />
                  {businessForm.formState.errors.gstNumber && (
                    <p className="text-red-600 text-sm mt-1">
                      {businessForm.formState.errors.gstNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Business Type *
                  </label>
                  <select
                    {...businessForm.register("businessType")}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select business type</option>
                    {BUSINESS_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {businessForm.formState.errors.businessType && (
                    <p className="text-red-600 text-sm mt-1">
                      {businessForm.formState.errors.businessType.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    value={businessForm.watch("pincode")}
                    onChange={(e) =>
                      handlePincodeChange(e.target.value.slice(0, 6))
                    }
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="6-digit pincode"
                    maxLength={6}
                  />
                  {businessForm.formState.errors.pincode && (
                    <p className="text-red-600 text-sm mt-1">
                      {businessForm.formState.errors.pincode.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      {...businessForm.register("city")}
                      readOnly
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg bg-neutral-50"
                      placeholder="Auto-filled"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      {...businessForm.register("state")}
                      readOnly
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg bg-neutral-50"
                      placeholder="Auto-filled"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Years in Business
                  </label>
                  <input
                    type="number"
                    {...businessForm.register("yearsInBusiness")}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Contact & Security */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-neutral-900">
                  Contact & Security
                </h2>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Owner/Manager Name *
                  </label>
                  <input
                    type="text"
                    {...contactForm.register("ownerName")}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Full name"
                  />
                  {contactForm.formState.errors.ownerName && (
                    <p className="text-red-600 text-sm mt-1">
                      {contactForm.formState.errors.ownerName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Mobile Number * {contactForm.watch("otpVerified") && (
                      <span className="text-green-600 text-sm ml-2">✓ Verified</span>
                    )}
                  </label>
                  {!contactForm.watch("otpVerified") ? (
                    <div className="space-y-3">
                      <input
                        type="tel"
                        {...contactForm.register("mobile")}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="+919876543210"
                      />
                      <button
                        onClick={handleSendOTP}
                        disabled={isLoading}
                        className="w-full py-2 bg-primary text-white font-medium rounded-lg hover:bg-blue-900 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                      >
                        {isLoading && <Loader2 size={16} className="animate-spin" />}
                        Send OTP
                      </button>

                      {otpSent && (
                        <div className="space-y-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex gap-2">
                            {otp.map((digit, index) => (
                              <input
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
                                className="w-10 h-10 text-center font-bold border-2 border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              />
                            ))}
                          </div>

                          {demoOTP && (
                            <div className="text-sm text-blue-900">
                              <strong>Demo OTP:</strong> {demoOTP}
                            </div>
                          )}

                          <button
                            onClick={() => {
                              setOtpSent(false);
                              setOtp(["", "", "", "", "", ""]);
                            }}
                            disabled={isLoading || otpExpiry > 0}
                            className="text-sm text-primary hover:underline disabled:text-neutral-400"
                          >
                            {otpExpiry > 0 ? `Resend in ${otpExpiry}s` : "Send OTP Again"}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-300 rounded-lg">
                      <Check size={20} className="text-green-600" />
                      <div>
                        <p className="text-green-900 font-medium">Phone Verified</p>
                        <p className="text-green-800 text-sm">{contactForm.watch("mobile")}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...contactForm.register("email")}
                    onChange={(e) => {
                      contactForm.setValue("email", e.target.value);
                      if (e.target.value.includes("@")) {
                        validateEmail(e.target.value);
                      }
                    }}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your@company.com"
                  />
                  {contactForm.formState.errors.email && (
                    <p className="text-red-600 text-sm mt-1">
                      {contactForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      {...contactForm.register("password")}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="••••••••"
                    />
                  </div>
                  {contactForm.watch("password") && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              passwordStrength.strength === 0
                                ? "w-1/4 bg-red-500"
                                : passwordStrength.strength === 1
                                ? "w-2/4 bg-yellow-500"
                                : passwordStrength.strength === 2
                                ? "w-3/4 bg-blue-500"
                                : "w-full bg-green-500"
                            }`}
                          />
                        </div>
                        <span className="text-xs font-medium text-neutral-600">
                          {passwordStrength.label}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600">
                        Use 8+ characters with uppercase, numbers, and symbols
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    {...contactForm.register("confirmPassword")}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                  />
                  {contactForm.formState.errors.confirmPassword && (
                    <p className="text-red-600 text-sm mt-1">
                      {contactForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Plan Selection */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-neutral-900">
                  Select Your Plan
                </h2>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-4">
                    Estimated Monthly Spend (Optional)
                  </label>
                  <select
                    {...planForm.register("estimatedSpend")}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select range</option>
                    <option value="5000">₹0 - ₹5,000</option>
                    <option value="25000">₹5,000 - ₹25,000</option>
                    <option value="50000">₹25,000 - ₹50,000</option>
                    <option value="100000">₹50,000 - ₹1,00,000</option>
                    <option value="500000">₹1,00,000+</option>
                  </select>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  {PLANS.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => planForm.setValue("selectedPlan", plan.id as any)}
                      className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
                        planForm.watch("selectedPlan") === plan.id
                          ? "border-primary bg-blue-50"
                          : "border-neutral-200 hover:border-primary"
                      }`}
                    >
                      {plan.badge && (
                        <div className="absolute -top-3 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                          {plan.badge}
                        </div>
                      )}

                      {planForm.watch("selectedPlan") === plan.id && (
                        <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Check size={16} className="text-white" />
                        </div>
                      )}

                      <h3 className="font-bold text-lg text-neutral-900 mb-2">
                        {plan.name}
                      </h3>
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-primary">
                          {plan.price}
                        </span>
                        {plan.period && (
                          <span className="text-neutral-600 text-sm">{plan.period}</span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-600 mb-4">
                        {plan.description}
                      </p>

                      <ul className="space-y-2">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex gap-2 text-sm text-neutral-700">
                            <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-neutral-900 mb-2">
                    Why Choose SpareKart?
                  </h4>
                  <ul className="space-y-1 text-sm text-neutral-700">
                    <li>✓ 100% authentic spare parts only</li>
                    <li>✓ Pan-India same-day delivery available</li>
                    <li>✓ Direct sourcing with best prices</li>
                    <li>✓ Dedicated account manager for Pro & Enterprise</li>
                    <li>✓ GST invoicing & extended credit terms</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-neutral-200">
              <button
                onClick={handlePrevStep}
                disabled={currentStep === 1 || isLoading}
                className="flex-1 py-3 border-2 border-neutral-300 text-neutral-900 font-semibold rounded-lg hover:bg-neutral-50 disabled:opacity-50 transition-colors"
              >
                Back
              </button>

              {currentStep < 3 ? (
                <button
                  onClick={handleNextStep}
                  disabled={isLoading}
                  className="flex-1 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue-900 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 size={18} className="animate-spin" />}
                  Next <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 size={18} className="animate-spin" />}
                  Complete Registration
                </button>
              )}
            </div>
          </div>

          {/* Sign in link */}
          <p className="text-center text-neutral-600 mt-6">
            Already have an account?{" "}
            <a href="/b2b/login" className="text-primary hover:underline font-semibold">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
