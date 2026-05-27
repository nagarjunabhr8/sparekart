import { NextResponse } from "next/server";
import { signJWT } from "@/lib/jwt";

// Mock user database (same as login)
const mockUsers = [
  {
    userId: "user_001",
    email: "demo@sparekart.com",
    businessName: "Demo Auto Parts",
    phone: "+919876543210",
    role: "admin",
    verified: true,
  },
  {
    userId: "user_002",
    email: "mechanic@sparekart.com",
    businessName: "ABC Auto Repair",
    phone: "+919876543211",
    role: "user",
    verified: true,
  },
];

// Store OTP temporarily (should be same as send/route.ts in production)
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, otp } = body;

    if (!phone || !otp) {
      return NextResponse.json(
        { error: "Phone and OTP are required" },
        { status: 400 }
      );
    }

    // Get stored OTP
    const stored = otpStore.get(phone);

    if (!stored) {
      return NextResponse.json(
        { error: "No OTP found. Please request a new OTP" },
        { status: 400 }
      );
    }

    // Check if expired
    if (stored.expiresAt < Date.now()) {
      otpStore.delete(phone);
      return NextResponse.json(
        { error: "OTP has expired. Please request a new OTP" },
        { status: 400 }
      );
    }

    // Verify OTP
    if (stored.otp !== otp) {
      return NextResponse.json(
        { error: "Invalid OTP. Please try again" },
        { status: 400 }
      );
    }

    // Clear OTP
    otpStore.delete(phone);

    // Find user by phone
    const user = mockUsers.find((u) => u.phone === phone);

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this phone number. Please register." },
        { status: 404 }
      );
    }

    // Generate JWT token
    const token = await signJWT({
      userId: user.userId,
      email: user.email,
      businessName: user.businessName,
      phone: user.phone,
      role: user.role,
    });

    // Create response with httpOnly cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          userId: user.userId,
          email: user.email,
          businessName: user.businessName,
          phone: user.phone,
          role: user.role,
        },
      },
      { status: 200 }
    );

    // Set httpOnly cookie
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("OTP verify error:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}

export function storeOTP(phone: string, otp: string) {
  const expiresAt = Date.now() + 5 * 60 * 1000;
  otpStore.set(phone, { otp, expiresAt });
}
