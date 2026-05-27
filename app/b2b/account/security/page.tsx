"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";
import { Check, Eye, EyeOff, Smartphone, Laptop, LogOut } from "lucide-react";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

interface Session {
  id: string;
  device: string;
  browser: string;
  ipAddress: string;
  lastActive: string;
  location: string;
  isCurrent: boolean;
}

export default function SecurityPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [sessions, setSessions] = useState<Session[]>([
    {
      id: "1",
      device: "Desktop",
      browser: "Chrome",
      ipAddress: "192.168.1.100",
      lastActive: "Just now",
      location: "Bangalore, India",
      isCurrent: true,
    },
    {
      id: "2",
      device: "iPhone",
      browser: "Safari",
      ipAddress: "103.45.67.89",
      lastActive: "2 hours ago",
      location: "Bangalore, India",
      isCurrent: false,
    },
    {
      id: "3",
      device: "iPad",
      browser: "Safari",
      ipAddress: "103.45.67.90",
      lastActive: "Yesterday at 10:30 AM",
      location: "Bangalore, India",
      isCurrent: false,
    },
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (_data: PasswordFormData) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Password changed");
      toast.success("Password changed successfully!");
      reset();
    } catch (error) {
      toast.error("Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutSession = (sessionId: string) => {
    setSessions(sessions.filter((s) => s.id !== sessionId));
    toast.success("Session logged out");
  };

  const handleLogoutAllOthers = () => {
    setSessions(sessions.filter((s) => s.isCurrent));
    toast.success("All other sessions have been logged out");
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        {/* Change Password */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Change Password</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  {...register("currentPassword")}
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-neutral-600 hover:text-primary"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-red-600 text-sm mt-1">{errors.currentPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  {...register("newPassword")}
                  type={showNewPassword ? "text" : "password"}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-2.5 text-neutral-600 hover:text-primary"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-600 text-sm mt-1">{errors.newPassword.message}</p>
              )}
              <p className="text-xs text-neutral-600 mt-1">
                Must be at least 8 characters with a mix of uppercase, lowercase, and numbers
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-neutral-600 hover:text-primary"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-900 disabled:opacity-50 font-medium"
            >
              <Check size={18} />
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* Active Sessions */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Active Sessions</h2>

          <div className="space-y-3 mb-6">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-start gap-4 p-4 border border-slate-200 rounded-lg">
                <div className="mt-1">
                  {session.device === "Desktop" ? (
                    <Laptop size={24} className="text-primary" />
                  ) : (
                    <Smartphone size={24} className="text-primary" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-neutral-900">
                      {session.device} • {session.browser}
                    </h4>
                    {session.isCurrent && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600">{session.location}</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    IP: {session.ipAddress} • Last active: {session.lastActive}
                  </p>
                </div>

                {!session.isCurrent && (
                  <button
                    onClick={() => handleLogoutSession(session.id)}
                    className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-neutral-700"
                  >
                    Logout
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleLogoutAllOthers}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg transition-colors font-medium text-sm"
          >
            <LogOut size={18} />
            Logout All Other Sessions
          </button>
        </div>

        {/* Security Tips */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Security Tips</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>✓ Use a strong, unique password with at least 8 characters</li>
            <li>✓ Never share your password with anyone, including support staff</li>
            <li>✓ Enable two-factor authentication for enhanced security</li>
            <li>✓ Regularly review your active sessions and logout unused devices</li>
            <li>✓ Change your password periodically (every 90 days recommended)</li>
          </ul>
        </div>
      </div>
    </>
  );
}
