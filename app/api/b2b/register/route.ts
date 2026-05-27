import { NextResponse } from "next/server";
import { signJWT } from "@/lib/jwt";

interface RegistrationPayload {
  businessName: string;
  gstNumber: string;
  businessType: string;
  city: string;
  state: string;
  pincode: string;
  yearsInBusiness?: number;
  ownerName: string;
  mobile: string;
  email: string;
  password: string;
  selectedPlan: string;
  estimatedSpend?: number;
}

interface RegisteredBusiness {
  businessId: string;
  businessName: string;
  gstNumber: string;
  businessType: string;
  city: string;
  state: string;
  pincode: string;
  yearsInBusiness: number;
  ownerName: string;
  mobile: string;
  email: string;
  password: string;
  selectedPlan: string;
  estimatedSpend: number;
  registeredAt: string;
  status: string;
  verified: boolean;
}

let registeredBusinesses: RegisteredBusiness[] = [];

export async function POST(request: Request) {
  try {
    const body: RegistrationPayload = await request.json();

    // Validate required fields
    if (
      !body.businessName?.trim() ||
      !body.gstNumber?.trim() ||
      !body.businessType ||
      !body.city?.trim() ||
      !body.state?.trim() ||
      !body.pincode?.trim() ||
      !body.ownerName?.trim() ||
      !body.mobile?.trim() ||
      !body.email?.trim() ||
      !body.password ||
      !body.selectedPlan
    ) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    // Validate GST format
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstRegex.test(body.gstNumber)) {
      return NextResponse.json(
        { error: "Invalid GST number format" },
        { status: 400 }
      );
    }

    // Validate phone format
    const phoneRegex = /^\+91[0-9]{10}$/;
    if (!phoneRegex.test(body.mobile)) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Validate password
    if (body.password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Validate plan
    if (!["starter", "professional", "enterprise"].includes(body.selectedPlan)) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    // Check for duplicate GST
    const gstExists = registeredBusinesses.some(
      (b) => b.gstNumber === body.gstNumber
    );
    if (gstExists) {
      return NextResponse.json(
        { error: "GST number already registered" },
        { status: 400 }
      );
    }

    // Check for duplicate email
    const emailExists = registeredBusinesses.some(
      (b) => b.email === body.email
    );
    if (emailExists) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Create new business registration
    const businessId = `biz_${Date.now()}`;
    const newBusiness: RegisteredBusiness = {
      businessId,
      businessName: body.businessName,
      gstNumber: body.gstNumber,
      businessType: body.businessType,
      city: body.city,
      state: body.state,
      pincode: body.pincode,
      yearsInBusiness: body.yearsInBusiness || 0,
      ownerName: body.ownerName,
      mobile: body.mobile,
      email: body.email,
      password: body.password, // In production, hash with bcrypt
      selectedPlan: body.selectedPlan,
      estimatedSpend: body.estimatedSpend || 0,
      registeredAt: new Date().toISOString(),
      status: "active",
      verified: true,
    };

    registeredBusinesses.push(newBusiness);

    // Generate JWT token
    const token = await signJWT({
      userId: businessId,
      email: body.email,
      businessName: body.businessName,
      phone: body.mobile,
      role: "user",
    });

    // Create response with httpOnly cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        business: {
          businessId,
          businessName: body.businessName,
          email: body.email,
          gstNumber: body.gstNumber,
          city: body.city,
          state: body.state,
          selectedPlan: body.selectedPlan,
        },
      },
      { status: 201 }
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
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register business" },
      { status: 500 }
    );
  }
}
