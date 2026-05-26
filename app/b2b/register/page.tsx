"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, Check, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

interface RegistrationData {
  // Step 1
  businessName: string;
  gstNumber: string;
  businessType: string;
  city: string;
  state: string;
  pincode: string;
  // Step 2
  ownerName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  // Step 3
  selectedPlan: string;
}

const businessTypes = ["Workshop", "Garage", "Fleet", "Dealer", "Individual"];
const states = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"];

const plans = [
  {
    name: "Starter",
    discount: "5%",
    features: ["₹10K min order", "5% discount", "Standard support", "30-day terms"],
  },
  {
    name: "Professional",
    discount: "15%",
    features: ["₹25K min order", "15% discount", "Dedicated manager", "30-day credit terms"],
    popular: true,
  },
  {
    name: "Enterprise",
    discount: "25%",
    features: ["Custom limits", "25% discount", "Dedicated team", "45-day credit terms"],
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<RegistrationData>({
    businessName: "",
    gstNumber: "",
    businessType: "",
    city: "",
    state: "",
    pincode: "",
    ownerName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    selectedPlan: "Professional",
  });

  const validateGST = (gst: string) => {
    return /^[0-9A-Z]{15}$/.test(gst);
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^[0-9]{10}$/.test(phone);
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    }
    if (!formData.gstNumber.trim()) {
      newErrors.gstNumber = "GST number is required";
    } else if (!validateGST(formData.gstNumber)) {
      newErrors.gstNumber = "GST must be 15 alphanumeric characters";
    }
    if (!formData.businessType) {
      newErrors.businessType = "Business type is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.state) {
      newErrors.state = "State is required";
    }
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^[0-9]{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = "Owner name is required";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!otpVerified) {
      newErrors.otp = "Please verify OTP";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = () => {
    if (!validatePhone(formData.phone)) {
      setErrors({ phone: "Please enter a valid 10-digit phone number" });
      return;
    }
    setOtpSent(true);
    toast.success("OTP sent to your phone!");
  };

  const handleVerifyOTP = () => {
    if (otp.length !== 6) {
      setErrors({ otp: "OTP must be 6 digits" });
      return;
    }
    setOtpVerified(true);
    setErrors({});
    toast.success("Phone verified!");
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
        setErrors({});
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3);
        setErrors({});
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/b2b/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Registration successful! Welcome to SpareKart B2B");
        setTimeout(() => {
          router.push("/b2b/account");
        }, 1500);
      } else {
        const error = await response.json();
        toast.error(error.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Error during registration. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="container-app max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Register Your Business</h1>
          <p className="text-neutral-600">Get verified and start ordering within 24 hours</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-900">Step {currentStep} of 3</span>
            <span className="text-sm text-neutral-600">{(currentStep / 3 * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step < currentStep
                    ? "bg-green-500 text-white"
                    : step === currentStep
                    ? "bg-primary text-white"
                    : "bg-neutral-200 text-neutral-600"
                }`}
              >
                {step < currentStep ? <Check size={20} /> : step}
              </div>
              <span className="text-xs font-medium text-neutral-600 text-center w-20">
                {step === 1 && "Business"}
                {step === 2 && "Contact"}
                {step === 3 && "Plan"}
              </span>
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-lg">
          {/* Step 1: Business Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900">Business Details</h2>

              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="e.g., ABC Workshop"
                />
                {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  GST Number (15 characters) *
                </label>
                <input
                  type="text"
                  value={formData.gstNumber}
                  onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none uppercase"
                  placeholder="e.g., 27AABCT1234H1Z0"
                  maxLength={15}
                />
                {errors.gstNumber && <p className="text-red-500 text-sm mt-1">{errors.gstNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Business Type *
                </label>
                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  <option value="">Select business type</option>
                  {businessTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.businessType && <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="e.g., Mumbai"
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="e.g., 400001"
                    maxLength={6}
                  />
                  {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  State *
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  <option value="">Select state</option>
                  {states.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>

              <p className="text-sm text-neutral-600">
                Already registered?{" "}
                <Link href="/b2b/login" className="text-primary font-medium hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          )}

          {/* Step 2: Contact & Auth */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900">Contact & Authentication</h2>

              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Owner Name *
                </label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="Full name"
                />
                {errors.ownerName && <p className="text-red-500 text-sm mt-1">{errors.ownerName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Phone Number (10 digits) *
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={otpSent}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:bg-neutral-100"
                    placeholder="10-digit phone number"
                    maxLength={10}
                  />
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={otpSent || !formData.phone}
                    className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {otpSent ? "OTP Sent" : "Send OTP"}
                  </button>
                </div>
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              {otpSent && !otpVerified && (
                <div>
                  <label className="block text-sm font-medium text-neutral-900 mb-2">
                    Enter OTP (6 digits) *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="000000"
                      maxLength={6}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOTP}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 whitespace-nowrap"
                    >
                      Verify
                    </button>
                  </div>
                  {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
                </div>
              )}

              {otpVerified && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                  ✓ Phone number verified
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="business@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Password (min 8 characters) *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="Enter password"
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="Confirm password"
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Plan Selection */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-900">Select Your Plan</h2>
              <p className="text-neutral-600">Choose the plan that works best for your business. You can upgrade anytime.</p>

              <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    onClick={() => setFormData({ ...formData, selectedPlan: plan.name })}
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                      formData.selectedPlan === plan.name
                        ? "border-primary bg-primary/5"
                        : "border-slate-200 hover:border-slate-300"
                    } ${plan.popular ? "relative" : ""}`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                        Popular
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-neutral-900 mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold text-primary mb-4">{plan.discount}</div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-neutral-600 flex gap-2">
                          <span className="text-green-500 font-bold">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {formData.selectedPlan === plan.name && (
                      <div className="mt-4 p-2 bg-primary text-white rounded text-center text-sm font-medium">
                        Selected
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> You can change your plan or upgrade anytime from your account dashboard.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1 || submitting}
              className="flex items-center gap-2 px-6 py-2 border border-slate-300 text-neutral-900 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
              Previous
            </button>
            <div className="flex-1" />
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting && <Loader size={18} className="animate-spin" />}
                {submitting ? "Registering..." : "Complete Registration"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
