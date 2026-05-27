import { NextResponse } from "next/server";
import { storeOTP } from "@/lib/otpUtils";

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
    storeOTP(phone, otp);

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
