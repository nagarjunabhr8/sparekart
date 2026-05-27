import { NextResponse } from "next/server";
import { signJWT } from "@/lib/jwt";

interface MockUser {
  userId: string;
  email: string;
  password: string;
  businessName: string;
  phone: string;
  role: "admin" | "user";
  verified: boolean;
  suspended: boolean;
}

// Mock user database
const mockUsers: MockUser[] = [
  {
    userId: "user_001",
    email: "demo@sparekart.com",
    password: "Demo@123", // In production, this would be hashed
    businessName: "Demo Auto Parts",
    phone: "+919876543210",
    role: "admin",
    verified: true,
    suspended: false,
  },
  {
    userId: "user_002",
    email: "mechanic@sparekart.com",
    password: "Mechanic@123",
    businessName: "ABC Auto Repair",
    phone: "+919876543211",
    role: "user",
    verified: true,
    suspended: false,
  },
  {
    userId: "user_003",
    email: "unverified@sparekart.com",
    password: "Test@123",
    businessName: "Unverified Business",
    phone: "+919876543212",
    role: "user",
    verified: false,
    suspended: false,
  },
  {
    userId: "user_004",
    email: "suspended@sparekart.com",
    password: "Test@123",
    businessName: "Suspended Business",
    phone: "+919876543213",
    role: "user",
    verified: true,
    suspended: true,
  },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user
    const user = mockUsers.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check password
    if (user.password !== password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if account is suspended
    if (user.suspended) {
      return NextResponse.json(
        {
          error: "Your account has been suspended. Please contact support.",
          code: "ACCOUNT_SUSPENDED",
        },
        { status: 403 }
      );
    }

    // Check if email is verified
    if (!user.verified) {
      return NextResponse.json(
        {
          error: "Please verify your email before logging in.",
          code: "EMAIL_UNVERIFIED",
        },
        { status: 403 }
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
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Failed to login" },
      { status: 500 }
    );
  }
}
