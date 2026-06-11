"use client";

import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import {
  Upload,
  Check,
  Trash2,
  AlertTriangle,
  Camera,
  Loader2,
} from "lucide-react";

interface ProfileData {
  businessName: string;
  gstNumber: string;
  businessType: string;
  registrationNumber?: string;
  primaryPhone: string;
  secondaryPhone?: string;
  email: string;
  website?: string;
  businessAddress: string;
  businessCity: string;
  businessState: string;
  businessPincode: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingPincode: string;
  sameAsBusinessAddress: boolean;
  logo?: string;
}

interface PlanInfo {
  type: "starter" | "professional" | "enterprise";
  name: string;
  monthlySpend: number;
  monthlyLimit: number;
  discount: number;
  features: string[];
}

const PLAN_INFO: Record<string, PlanInfo> = {
  starter: {
    type: "starter",
    name: "Starter",
    monthlySpend: 12500,
    monthlyLimit: 50000,
    discount: 5,
    features: [
      "Up to 50 orders/month",
      "Basic inventory management",
      "Email support",
      "Standard payment terms",
    ],
  },
  professional: {
    type: "professional",
    name: "Professional",
    monthlySpend: 35000,
    monthlyLimit: 200000,
    discount: 15,
    features: [
      "Unlimited orders",
      "Advanced analytics",
      "Priority support",
      "15-30 days credit terms",
      "Dedicated account manager",
    ],
  },
  enterprise: {
    type: "enterprise",
    name: "Enterprise",
    monthlySpend: 85000,
    monthlyLimit: 500000,
    discount: 25,
    features: [
      "Custom solutions",
      "API access",
      "White-label options",
      "Extended credit terms",
      "24/7 dedicated support",
    ],
  },
};

const BUSINESS_TYPES = [
  "Workshop / Service Center",
  "Fleet Operator",
  "Spare Parts Dealer",
  "Garage Chain",
  "Individual Mechanic",
];

export default function ProfilePage() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showImageCrop, setShowImageCrop] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileData, setProfileData] = useState<ProfileData>({
    businessName: "Demo Auto Parts",
    gstNumber: "27AABCT1234H1Z0",
    businessType: "Workshop / Service Center",
    registrationNumber: "REG-2024-001",
    primaryPhone: "+919876543210",
    secondaryPhone: "+919876543211",
    email: "demo@sparekart.com",
    website: "https://example.com",
    businessAddress: "123 Main Street, Workshop Building",
    businessCity: "Bangalore",
    businessState: "Karnataka",
    businessPincode: "560001",
    billingAddress: "123 Main Street, Workshop Building",
    billingCity: "Bangalore",
    billingState: "Karnataka",
    billingPincode: "560001",
    sameAsBusinessAddress: true,
    logo: "/images/logo.png",
  });

  const verificationStatus = {
    gstVerified: true,
    emailVerified: true,
    phoneVerified: true,
  };

  const currentPlan: PlanInfo = PLAN_INFO.professional;

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  // Handle profile field change
  const handleFieldChange = (field: keyof ProfileData, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsDraft(true);
  };

  // Handle same address toggle
  const handleSameAddress = (isSame: boolean) => {
    if (isSame) {
      setProfileData((prev) => ({
        ...prev,
        sameAsBusinessAddress: true,
        billingAddress: prev.businessAddress,
        billingCity: prev.businessCity,
        billingState: prev.businessState,
        billingPincode: prev.businessPincode,
      }));
    } else {
      setProfileData((prev) => ({
        ...prev,
        sameAsBusinessAddress: false,
      }));
    }
    setIsDraft(true);
  };

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      // Read file and show crop modal
      const reader = new FileReader();
      reader.onload = (e) => {
        setCropImage(e.target?.result as string);
        setShowImageCrop(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag and drop
  const handleDragDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const input = fileInputRef.current;
      if (input) {
        input.files = e.dataTransfer.files;
        handleLogoUpload({
          target: input,
        } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  // Handle crop confirm (simplified - in production use react-easy-crop)
  const handleCropConfirm = () => {
    if (cropImage) {
      setLogoPreview(cropImage);
      setProfileData((prev) => ({
        ...prev,
        logo: cropImage,
      }));
      setShowImageCrop(false);
      setCropImage(null);
      setIsDraft(true);
      toast.success("Logo updated");
    }
  };

  // Handle save profile
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/b2b/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to save profile");
        return;
      }

      toast.success("Profile saved successfully");
      setIsDraft(false);
    } catch (error) {
      toast.error("Failed to save profile");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/b2b/account", {
        method: "DELETE",
      });

      if (!response.ok) {
        toast.error("Failed to delete account");
        return;
      }

      toast.success("Account deleted successfully");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      toast.error("Failed to delete account");
      console.error(error);
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div data-testid="account-profile-page" className="min-h-screen bg-gradient-to-br from-blue-50 to-neutral-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Business Profile
            </h1>
            <p className="text-neutral-600">
              Manage your business information and account settings
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Logo Section */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-xl font-bold text-neutral-900 mb-6">
                Business Logo
              </h2>

              <div className="flex items-start gap-8">
                {/* Logo Preview */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-lg border-2 border-neutral-200 bg-neutral-50 flex items-center justify-center overflow-hidden">
                    {logoPreview || profileData.logo ? (
                      <img
                        src={logoPreview || profileData.logo}
                        alt="Business Logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera size={48} className="text-neutral-300" />
                    )}
                  </div>
                </div>

                {/* Upload Area */}
                <div className="flex-1">
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDragDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-blue-50 transition-colors"
                  >
                    <Upload size={32} className="mx-auto mb-2 text-neutral-400" />
                    <p className="text-neutral-900 font-medium">
                      Drag and drop your logo here
                    </p>
                    <p className="text-sm text-neutral-600">
                      or click to select a file
                    </p>
                    <p className="text-xs text-neutral-500 mt-2">
                      PNG, JPG up to 5MB • Recommended: 512x512px
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />

                  {(logoPreview || profileData.logo) && (
                    <button
                      onClick={() => {
                        setLogoPreview(null);
                        setProfileData((prev) => ({ ...prev, logo: undefined }));
                        setIsDraft(true);
                      }}
                      className="mt-4 text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove Logo
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Image Crop Modal */}
            {showImageCrop && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                  <h3 className="text-lg font-bold text-neutral-900 mb-4">
                    Crop Your Logo
                  </h3>

                  {cropImage && (
                    <div className="mb-6 rounded-lg overflow-hidden bg-neutral-100">
                      <img
                        src={cropImage}
                        alt="Crop Preview"
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowImageCrop(false);
                        setCropImage(null);
                      }}
                      className="flex-1 py-2 border border-neutral-300 text-neutral-900 rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCropConfirm}
                      className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-blue-900 transition-colors"
                    >
                      Use This Image
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Business Information Section */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-xl font-bold text-neutral-900 mb-6">
                Business Information
              </h2>

              <div className="space-y-6">
                {/* Business Name */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    value={profileData.businessName}
                    onChange={(e) =>
                      handleFieldChange("businessName", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your business name"
                  />
                </div>

                {/* GST and Verification */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    GST Number *
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={profileData.gstNumber}
                      readOnly
                      className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg bg-neutral-50 text-neutral-700"
                      placeholder="GST Number"
                    />
                    {verificationStatus.gstVerified && (
                      <div className="flex items-center gap-2 px-3 py-3 bg-green-50 border border-green-200 rounded-lg">
                        <Check size={18} className="text-green-600" />
                        <span className="text-green-700 text-sm font-medium">
                          Verified
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    GST cannot be changed. Contact support if you need to update it.
                  </p>
                </div>

                {/* Business Type */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Business Type *
                    </label>
                    <select
                      value={profileData.businessType}
                      onChange={(e) =>
                        handleFieldChange("businessType", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {BUSINESS_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      value={profileData.registrationNumber || ""}
                      onChange={(e) =>
                        handleFieldChange("registrationNumber", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Optional registration number"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-neutral-900">
                    Contact Information
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Primary Phone *
                      </label>
                      <input
                        type="tel"
                        value={profileData.primaryPhone}
                        readOnly
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg bg-neutral-50 text-neutral-700"
                      />
                      {verificationStatus.phoneVerified && (
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                          <Check size={14} /> Phone verified
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Secondary Phone
                      </label>
                      <input
                        type="tel"
                        value={profileData.secondaryPhone || ""}
                        onChange={(e) =>
                          handleFieldChange("secondaryPhone", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Optional secondary phone"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email Address *
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="email"
                        value={profileData.email}
                        readOnly
                        className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg bg-neutral-50 text-neutral-700"
                      />
                      {verificationStatus.emailVerified && (
                        <div className="flex items-center gap-2 px-3 py-3 bg-green-50 border border-green-200 rounded-lg">
                          <Check size={18} className="text-green-600" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      Email cannot be changed here. Go to Security settings to change it.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={profileData.website || ""}
                      onChange={(e) =>
                        handleFieldChange("website", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-xl font-bold text-neutral-900 mb-6">
                Business Address
              </h2>

              <div className="space-y-6">
                {/* Business Address */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Business Address *
                  </label>
                  <textarea
                    value={profileData.businessAddress}
                    onChange={(e) =>
                      handleFieldChange("businessAddress", e.target.value)
                    }
                    rows={2}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Street address"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={profileData.businessCity}
                      onChange={(e) =>
                        handleFieldChange("businessCity", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      value={profileData.businessState}
                      onChange={(e) =>
                        handleFieldChange("businessState", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      value={profileData.businessPincode}
                      onChange={(e) =>
                        handleFieldChange("businessPincode", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Billing Address Toggle */}
                <div className="pt-6 border-t border-neutral-200">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profileData.sameAsBusinessAddress}
                      onChange={(e) => handleSameAddress(e.target.checked)}
                      className="w-5 h-5 rounded border-neutral-300 text-primary"
                    />
                    <span className="text-neutral-700 font-medium">
                      Billing address same as business address
                    </span>
                  </label>
                </div>

                {/* Billing Address */}
                {!profileData.sameAsBusinessAddress && (
                  <div className="space-y-4 pt-6 border-t border-neutral-200">
                    <h3 className="font-medium text-neutral-900">
                      Billing Address
                    </h3>

                    <textarea
                      value={profileData.billingAddress}
                      onChange={(e) =>
                        handleFieldChange("billingAddress", e.target.value)
                      }
                      rows={2}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Billing street address"
                    />

                    <div className="grid md:grid-cols-3 gap-6">
                      <input
                        type="text"
                        value={profileData.billingCity}
                        onChange={(e) =>
                          handleFieldChange("billingCity", e.target.value)
                        }
                        className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="City"
                      />

                      <input
                        type="text"
                        value={profileData.billingState}
                        onChange={(e) =>
                          handleFieldChange("billingState", e.target.value)
                        }
                        className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="State"
                      />

                      <input
                        type="text"
                        value={profileData.billingPincode}
                        onChange={(e) =>
                          handleFieldChange("billingPincode", e.target.value)
                        }
                        className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Pincode"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Current Plan Section */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-xl font-bold text-neutral-900 mb-6">
                Current B2B Plan
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Plan Info */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-neutral-900">
                          {currentPlan.name}
                        </h3>
                        <span className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                          Active
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600">
                        Discount applied: <strong>{currentPlan.discount}%</strong>
                      </p>
                    </div>
                  </div>

                  {/* Monthly Spend */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-neutral-600 mb-2">
                      Monthly spend this month
                    </p>
                    <div className="flex items-end gap-2 mb-3">
                      <span className="text-3xl font-bold text-primary">
                        ₹{currentPlan.monthlySpend.toLocaleString("en-IN")}
                      </span>
                      <span className="text-neutral-600">
                        / ₹{currentPlan.monthlyLimit.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="w-full bg-neutral-300 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all"
                        style={{
                          width: `${(currentPlan.monthlySpend / currentPlan.monthlyLimit) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-neutral-600 mt-2">
                      {Math.round(
                        (currentPlan.monthlySpend / currentPlan.monthlyLimit) * 100
                      )}% of monthly limit used
                    </p>
                  </div>

                  <button className="w-full py-2 bg-primary text-white font-medium rounded-lg hover:bg-blue-900 transition-colors">
                    Upgrade Plan
                  </button>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-4">
                    Plan Features
                  </h4>
                  <ul className="space-y-3">
                    {currentPlan.features.map((feature, idx) => (
                      <li key={idx} className="flex gap-3 text-neutral-700">
                        <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Verification Status Section */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-xl font-bold text-neutral-900 mb-6">
                Verification Status
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {/* GST Verification */}
                <div className="border border-neutral-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Check size={20} className="text-green-600" />
                    </div>
                    <h3 className="font-semibold text-neutral-900">
                      GST Verified
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Your GST number has been verified with the government database.
                  </p>
                </div>

                {/* Email Verification */}
                <div className="border border-neutral-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Check size={20} className="text-green-600" />
                    </div>
                    <h3 className="font-semibold text-neutral-900">
                      Email Verified
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Your email address has been verified and is active.
                  </p>
                </div>

                {/* Phone Verification */}
                <div className="border border-neutral-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Check size={20} className="text-green-600" />
                    </div>
                    <h3 className="font-semibold text-neutral-900">
                      Phone Verified
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Your phone number has been verified via OTP.
                  </p>
                </div>
              </div>
            </div>

            {/* Save Changes Bar */}
            {isDraft && (
              <div className="fixed bottom-8 right-8 flex gap-3 bg-white rounded-lg shadow-lg p-4 border-l-4 border-primary">
                <div>
                  <p className="text-sm font-medium text-neutral-900">
                    You have unsaved changes
                  </p>
                  <p className="text-xs text-neutral-600">
                    Click Save to apply changes to your profile
                  </p>
                </div>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-blue-900 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {isSaving && <Loader2 size={16} className="animate-spin" />}
                  Save
                </button>
              </div>
            )}

            {/* Account Deletion Section */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-8">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-red-900 mb-2">
                    Delete Account
                  </h2>
                  <p className="text-red-800">
                    Permanently delete your business account and all associated data. This action cannot be undone.
                  </p>
                </div>

                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Trash2 size={18} />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">
                Delete Account?
              </h3>
            </div>

            <p className="text-neutral-600 mb-6">
              This will permanently delete your account and all associated data. This action cannot be undone.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-900 font-medium">
                ⚠️ You will lose access to:
              </p>
              <ul className="text-sm text-red-800 mt-2 space-y-1">
                <li>• All order history</li>
                <li>• Account credits and rewards</li>
                <li>• Stored addresses and preferences</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 py-2 border border-neutral-300 text-neutral-900 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 size={16} className="animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
