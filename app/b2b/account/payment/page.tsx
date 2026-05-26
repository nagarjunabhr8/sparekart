"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { Trash2, Plus, Check, AlertCircle } from "lucide-react";

const paymentMethodSchema = z.object({
  type: z.enum(["UPI", "NEFT"]),
  upiId: z.string().optional(),
  accountHolderName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
  bankName: z.string().optional(),
}).refine(
  (data) => {
    if (data.type === "UPI") return !!data.upiId;
    return !!data.accountNumber && !!data.ifscCode;
  },
  { message: "Please fill in required fields for selected payment type" }
);

type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;

interface PaymentMethod extends PaymentMethodFormData {
  id: string;
  isDefault: boolean;
}

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "UPI",
      upiId: "techauto@okhdfcbank",
      isDefault: true,
    },
    {
      id: "2",
      type: "NEFT",
      accountHolderName: "Tech Auto Services",
      accountNumber: "0123456789012345",
      ifscCode: "HDFC0001234",
      bankName: "HDFC Bank",
      isDefault: false,
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [paymentType, setPaymentType] = useState<"UPI" | "NEFT">("UPI");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: { type: "UPI" },
  });

  const selectedType = watch("type");

  const onSubmit = async (data: PaymentMethodFormData) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newMethod: PaymentMethod = {
        ...data,
        id: Date.now().toString(),
        isDefault: methods.length === 0,
      };
      setMethods([...methods, newMethod]);
      toast.success("Payment method added successfully!");
      reset({ type: "UPI" });
      setPaymentType("UPI");
    } catch (error) {
      toast.error("Failed to add payment method");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = (id: string) => {
    setMethods(
      methods.map((m) => ({
        ...m,
        isDefault: m.id === id,
      }))
    );
    toast.success("Default payment method updated");
  };

  const handleRemove = (id: string) => {
    if (methods.length === 1) {
      toast.error("You must have at least one payment method");
      return;
    }
    setMethods(methods.filter((m) => m.id !== id));
    toast.success("Payment method removed");
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        {/* Credit Terms Widget */}
        <div className="bg-gradient-to-r from-primary to-blue-800 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Credit Facilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-blue-100 text-sm mb-1">Credit Limit</p>
              <p className="text-3xl font-bold">₹2,00,000</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Available Credit</p>
              <p className="text-3xl font-bold">₹1,50,000</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Credit Terms</p>
              <p className="text-3xl font-bold">30 Days</p>
            </div>
          </div>
        </div>

        {/* Add Payment Method Form */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Add Payment Method</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Payment Type
              </label>
              <div className="flex gap-4">
                {["UPI", "NEFT"].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      {...register("type")}
                      type="radio"
                      value={type}
                      className="w-4 h-4 border-slate-300"
                    />
                    <span className="text-sm font-medium text-neutral-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {selectedType === "UPI" ? (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  UPI ID
                </label>
                <input
                  {...register("upiId")}
                  type="text"
                  placeholder="yourname@upibank"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.upiId && (
                  <p className="text-red-600 text-sm mt-1">{errors.upiId.message}</p>
                )}
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Account Holder Name
                  </label>
                  <input
                    {...register("accountHolderName")}
                    type="text"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.accountHolderName && (
                    <p className="text-red-600 text-sm mt-1">{errors.accountHolderName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Bank Name
                  </label>
                  <input
                    {...register("bankName")}
                    type="text"
                    placeholder="HDFC Bank"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.bankName && (
                    <p className="text-red-600 text-sm mt-1">{errors.bankName.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Account Number
                    </label>
                    <input
                      {...register("accountNumber")}
                      type="text"
                      placeholder="0123456789012345"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.accountNumber && (
                      <p className="text-red-600 text-sm mt-1">{errors.accountNumber.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      IFSC Code
                    </label>
                    <input
                      {...register("ifscCode")}
                      type="text"
                      placeholder="HDFC0001234"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.ifscCode && (
                      <p className="text-red-600 text-sm mt-1">{errors.ifscCode.message}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {errors.root && (
              <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                <AlertCircle size={18} className="flex-shrink-0" />
                {errors.root.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-900 disabled:opacity-50"
            >
              <Plus size={18} />
              {isLoading ? "Adding..." : "Add Payment Method"}
            </button>
          </form>
        </div>

        {/* Saved Methods */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-neutral-900">Saved Payment Methods</h3>

          {methods.map((method) => (
            <div key={method.id} className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-neutral-900">{method.type}</h4>
                    {method.isDefault && (
                      <span className="text-xs bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>

                  {method.type === "UPI" ? (
                    <p className="text-sm text-neutral-600">{method.upiId}</p>
                  ) : (
                    <>
                      <p className="text-sm text-neutral-600">{method.bankName}</p>
                      <p className="text-sm text-neutral-600">{method.accountHolderName}</p>
                      <p className="text-sm text-neutral-600">
                        Account: ****{method.accountNumber?.slice(-4)}
                      </p>
                      <p className="text-sm text-neutral-600">IFSC: {method.ifscCode}</p>
                    </>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  {!method.isDefault && (
                    <button
                      onClick={() => handleSetDefault(method.id)}
                      className="px-3 py-1 text-sm border border-slate-300 rounded-lg hover:bg-slate-50"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleRemove(method.id)}
                    className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
