import { NextResponse } from "next/server";

// Store OTP temporarily (in production, use Redis or database)
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Validate phone format
    const phoneRegex = /^\+91[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: "Invalid phone number. Must be +91 followed by 10 digits" },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with 5-minute expiry
    const expiresAt = Date.now() + 5 * 60 * 1000;
    otpStore.set(phone, { otp, expiresAt });

    console.log(`[OTP] Phone: ${phone}, OTP: ${otp}`);

    return NextResponse.json(
      {
        success: true,
        message: "OTP sent successfully",
        phone,
        // For demo purposes only - in production, never return OTP
        demoOTP: otp,
        expiresIn: 300, // seconds
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("OTP send error:", error);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}

export function getOTP(phone: string): string | null {
  const stored = otpStore.get(phone);
  if (!stored) return null;

  // Check if expired
  if (stored.expiresAt < Date.now()) {
    otpStore.delete(phone);
    return null;
  }

  return stored.otp;
}

export function clearOTP(phone: string) {
  otpStore.delete(phone);
}
