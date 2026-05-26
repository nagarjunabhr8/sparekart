"use client";

import { X, Mail, Phone, CheckCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface StockNotifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  partId: string;
  partName: string;
}

export default function StockNotifyModal({
  isOpen,
  onClose,
  partId,
  partName,
}: StockNotifyModalProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [channel, setChannel] = useState<"email" | "sms">("email");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate input
      if (channel === "email") {
        if (!contact.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          toast.error("Please enter a valid email address");
          setLoading(false);
          return;
        }
      } else {
        if (!contact.match(/^[0-9]{10}$/)) {
          toast.error("Please enter a valid 10-digit phone number");
          setLoading(false);
          return;
        }
      }

      // Submit notification request
      const response = await fetch("/api/notifications/stock-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partId,
          channel,
          contact,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setStep("success");
        setTimeout(() => {
          onClose();
          setStep("form");
          setContact("");
        }, 2000);
      } else {
        toast.error("Failed to set up notification. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error setting up notification");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6 shadow-xl">
        {step === "form" ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Get Notified</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <p className="text-neutral-600 mb-6">
              We'll notify you as soon as <span className="font-semibold">{partName}</span> is back in stock.
            </p>

            {/* Channel Selector */}
            <div className="space-y-3 mb-6">
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Notification method
              </label>

              <div
                onClick={() => setChannel("email")}
                className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  channel === "email"
                    ? "border-primary bg-primary/5"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <Mail size={18} className={channel === "email" ? "text-primary" : "text-neutral-400"} />
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">Email</p>
                  <p className="text-xs text-neutral-600">Get notified via email</p>
                </div>
                {channel === "email" && <div className="w-2 h-2 bg-primary rounded-full"></div>}
              </div>

              <div
                onClick={() => setChannel("sms")}
                className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  channel === "sms"
                    ? "border-primary bg-primary/5"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <Phone size={18} className={channel === "sms" ? "text-primary" : "text-neutral-400"} />
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">SMS</p>
                  <p className="text-xs text-neutral-600">Get notified via text message</p>
                </div>
                {channel === "sms" && <div className="w-2 h-2 bg-primary rounded-full"></div>}
              </div>
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  {channel === "email" ? "Email Address" : "Phone Number"}
                </label>
                <input
                  type={channel === "email" ? "email" : "tel"}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder={channel === "email" ? "your@email.com" : "10-digit number"}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-slate-300 text-neutral-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !contact}
                  className="flex-1 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Setting up..." : "Notify Me"}
                </button>
              </div>
            </form>
          </>
        ) : (
          // Success State
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">All set!</h3>
            <p className="text-neutral-600 mb-4">
              You'll be notified when this part is back in stock.
            </p>
            <p className="text-sm text-neutral-500">
              Check your {channel === "email" ? "email" : "phone"} for updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
