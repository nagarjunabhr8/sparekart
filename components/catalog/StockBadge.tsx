"use client";

import { AlertCircle, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface StockBadgeProps {
  qty: number;
  expectedDate?: string;
  showUrgency?: boolean;
}

export default function StockBadge({
  qty,
  expectedDate,
  showUrgency = true,
}: StockBadgeProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (qty > 3 || qty === 0) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const expirationTime = now + 24 * 60 * 60 * 1000; // 24 hours from now
      const distance = expirationTime - now;

      if (distance > 0) {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}h ${minutes}m`);
      }
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [qty]);

  // Format expected date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // In Stock - Green
  if (qty > 10) {
    return (
      <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-300">
        <span className="w-2 h-2 bg-green-600 rounded-full"></span>
        In Stock ({qty} units)
      </div>
    );
  }

  // Low Stock - Amber with Urgency
  if (qty > 0 && qty <= 10) {
    return (
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium border border-amber-300">
          <AlertCircle size={14} />
          Only {qty} left
        </div>
        {showUrgency && qty <= 3 && (
          <div className="inline-flex ml-2 items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-semibold border border-red-200">
            <Zap size={12} className="text-red-600" />
            Selling fast {timeLeft && `(${timeLeft} left)`}
          </div>
        )}
      </div>
    );
  }

  // Out of Stock - Red
  if (qty === 0) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium border border-red-300">
        <AlertCircle size={14} />
        {expectedDate
          ? `Expected ~${formatDate(expectedDate)}`
          : "Currently Unavailable"}
      </div>
    );
  }

  return null;
}
