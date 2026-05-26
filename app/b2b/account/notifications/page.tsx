"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Mail, MessageSquare, ShoppingCart, Truck, AlertCircle, Check } from "lucide-react";

interface NotificationSettings {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  email: boolean;
  sms: boolean;
}

export default function NotificationsPage() {
  const [settings, setSettings] = useState<NotificationSettings[]>([
    {
      id: "order_placed",
      title: "Order Placed",
      description: "Get notified when your order is successfully placed",
      icon: <ShoppingCart size={20} className="text-primary" />,
      email: true,
      sms: true,
    },
    {
      id: "order_shipped",
      title: "Order Shipped",
      description: "Receive updates when your order is shipped with tracking information",
      icon: <Truck size={20} className="text-primary" />,
      email: true,
      sms: true,
    },
    {
      id: "order_delivered",
      title: "Order Delivered",
      description: "Get confirmation when your order is delivered",
      icon: <Check size={20} className="text-green-600" />,
      email: true,
      sms: false,
    },
    {
      id: "payment_reminder",
      title: "Payment Reminders",
      description: "Reminders for upcoming payment due dates",
      icon: <AlertCircle size={20} className="text-amber-600" />,
      email: true,
      sms: true,
    },
    {
      id: "promotional",
      title: "Promotional Offers",
      description: "Special discounts, offers, and new product launches",
      icon: <Mail size={20} className="text-primary" />,
      email: true,
      sms: false,
    },
    {
      id: "account_updates",
      title: "Account Updates",
      description: "Important account security and policy updates",
      icon: <AlertCircle size={20} className="text-red-600" />,
      email: true,
      sms: false,
    },
  ]);

  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = async (id: string, channel: "email" | "sms") => {
    const newSettings = settings.map((s) =>
      s.id === id
        ? {
            ...s,
            [channel]: !s[channel],
          }
        : s
    );
    setSettings(newSettings);

    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success("Notification preferences updated");
    } catch (error) {
      toast.error("Failed to update preferences");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Notification Preferences</h2>
          <p className="text-neutral-600">Manage how you receive updates about your orders and account</p>
        </div>

        {/* Global Controls */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h3 className="font-semibold text-blue-900 mb-4">Global Settings</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded border-blue-300"
              />
              <span className="text-sm font-medium text-blue-900">
                Enable all notifications
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded border-blue-300"
              />
              <span className="text-sm font-medium text-blue-900">
                Quiet hours (9 PM - 8 AM, no SMS notifications)
              </span>
            </label>
          </div>
        </div>

        {/* Notification Types */}
        <div className="space-y-3">
          {settings.map((setting) => (
            <div key={setting.id} className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-start gap-4">
                <div className="mt-1">{setting.icon}</div>

                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900 mb-1">{setting.title}</h3>
                  <p className="text-sm text-neutral-600">{setting.description}</p>
                </div>

                {/* Toggle Buttons */}
                <div className="flex gap-4 ml-4">
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => handleToggle(setting.id, "email")}
                      disabled={isSaving}
                      className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                        setting.email
                          ? "bg-primary text-white"
                          : "bg-slate-100 text-neutral-600 hover:bg-slate-200"
                      }`}
                      title="Email notification"
                    >
                      <Mail size={18} />
                    </button>
                    <span className="text-xs text-neutral-600 font-medium">Email</span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => handleToggle(setting.id, "sms")}
                      disabled={isSaving}
                      className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                        setting.sms
                          ? "bg-primary text-white"
                          : "bg-slate-100 text-neutral-600 hover:bg-slate-200"
                      }`}
                      title="SMS notification"
                    >
                      <MessageSquare size={18} />
                    </button>
                    <span className="text-xs text-neutral-600 font-medium">SMS</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Email Frequency */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="font-semibold text-neutral-900 mb-4">Email Digest Frequency</h3>
          <div className="space-y-3">
            {[
              { label: "Real-time", value: "realtime", description: "Immediate notifications" },
              {
                label: "Daily Digest",
                value: "daily",
                description: "All updates summarized once a day",
              },
              {
                label: "Weekly Digest",
                value: "weekly",
                description: "All updates summarized once a week",
              },
            ].map((option) => (
              <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="frequency"
                  value={option.value}
                  defaultChecked={option.value === "realtime"}
                  className="w-4 h-4 border-slate-300"
                />
                <div>
                  <span className="text-sm font-medium text-neutral-900">{option.label}</span>
                  <p className="text-xs text-neutral-600">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* SMS Settings */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="font-semibold text-neutral-900 mb-4">SMS Settings</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Mobile Number for SMS Alerts
              </label>
              <input
                type="tel"
                defaultValue="+91 9876543210"
                className="w-full md:w-1/2 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded border-slate-300"
              />
              <span className="text-sm font-medium text-neutral-700">
                Opt-out of promotional SMS (transactional SMS will continue)
              </span>
            </label>
          </div>
        </div>

        {/* Save Note */}
        <div className="bg-green-50 rounded-lg border border-green-200 p-4">
          <p className="text-sm text-green-800">
            ✓ Your notification preferences are automatically saved
          </p>
        </div>
      </div>
    </>
  );
}
