import { NextResponse } from "next/server";
import { signJWT } from "@/lib/jwt";
import { getOTP, clearOTP } from "@/lib/otpUtils";

interface MockUser {
  userId: string;
  email: string;
  businessName: string;
  phone: string;
  role: "admin" | "user";
  verified: boolean;
}

// Mock user database (same as login)
const mockUsers: MockUser[] = [
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
    const stored = getOTP(phone);

    if (!stored) {
      return NextResponse.json(
        { error: "No OTP found or expired. Please request a new OTP" },
        { status: 400 }
      );
    }

    // Verify OTP
    if (stored !== otp) {
      return NextResponse.json(
        { error: "Invalid OTP. Please try again" },
        { status: 400 }
      );
    }

    // Clear OTP
    clearOTP(phone);

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

