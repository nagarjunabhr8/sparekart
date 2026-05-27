import { NextResponse } from "next/server";

interface ProfileUpdatePayload {
  businessName: string;
  businessType: string;
  registrationNumber?: string;
  primaryPhone: string;
  secondaryPhone?: string;
  email: string;
  website?: string;
  businessAddress: string;
  businessCity: string;
  businessState: string;
  businessPincode: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingPincode: string;
  sameAsBusinessAddress: boolean;
  logo?: string;
  gstNumber?: string;
}

// Mock profile storage
const profileDatabase: Record<string, any> = {
  biz_default: {
    businessId: "biz_default",
    businessName: "Demo Auto Parts",
    gstNumber: "27AABCT1234H1Z0",
    businessType: "Workshop / Service Center",
    registrationNumber: "REG-2024-001",
    primaryPhone: "+919876543210",
    secondaryPhone: "+919876543211",
    email: "demo@sparekart.com",
    website: "https://example.com",
    businessAddress: "123 Main Street, Workshop Building",
    businessCity: "Bangalore",
    businessState: "Karnataka",
    businessPincode: "560001",
    billingAddress: "123 Main Street, Workshop Building",
    billingCity: "Bangalore",
    billingState: "Karnataka",
    billingPincode: "560001",
    sameAsBusinessAddress: true,
    logo: "/images/logo.png",
    updatedAt: new Date().toISOString(),
  },
};

export async function PATCH(request: Request) {
  try {
    const body: ProfileUpdatePayload = await request.json();

    // Validate required fields
    if (!body.businessName?.trim()) {
      return NextResponse.json(
        { error: "Business name is required" },
        { status: 400 }
      );
    }

    if (!body.businessType) {
      return NextResponse.json(
        { error: "Business type is required" },
        { status: 400 }
      );
    }

    if (!body.primaryPhone?.trim()) {
      return NextResponse.json(
        { error: "Primary phone is required" },
        { status: 400 }
      );
    }

    if (!body.email?.trim()) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!body.businessAddress?.trim()) {
      return NextResponse.json(
        { error: "Business address is required" },
        { status: 400 }
      );
    }

    // Get user ID from cookie or session (mock for now)
    const userId = "biz_default";

    // Update or create profile
    const existingProfile = profileDatabase[userId] || {};

    const updatedProfile = {
      ...existingProfile,
      businessId: userId,
      businessName: body.businessName,
      businessType: body.businessType,
      registrationNumber: body.registrationNumber,
      primaryPhone: body.primaryPhone,
      secondaryPhone: body.secondaryPhone,
      email: body.email,
      website: body.website,
      businessAddress: body.businessAddress,
      businessCity: body.businessCity,
      businessState: body.businessState,
      businessPincode: body.businessPincode,
      billingAddress: body.sameAsBusinessAddress
        ? body.businessAddress
        : body.billingAddress,
      billingCity: body.sameAsBusinessAddress
        ? body.businessCity
        : body.billingCity,
      billingState: body.sameAsBusinessAddress
        ? body.businessState
        : body.billingState,
      billingPincode: body.sameAsBusinessAddress
        ? body.businessPincode
        : body.billingPincode,
      sameAsBusinessAddress: body.sameAsBusinessAddress,
      logo: body.logo,
      updatedAt: new Date().toISOString(),
    };

    profileDatabase[userId] = updatedProfile;

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        profile: updatedProfile,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const userId = "biz_default";
    const profile = profileDatabase[userId];

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        profile,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
