import { NextRequest, NextResponse } from "next/server";

interface RegistrationPayload {
  businessName: string;
  gstNumber: string;
  businessType: string;
  city: string;
  state: string;
  pincode: string;
  ownerName: string;
  phone: string;
  email: string;
  password: string;
  selectedPlan: string;
}

interface RegisteredBusiness {
  id: string;
  businessName: string;
  gstNumber: string;
  businessType: string;
  city: string;
  state: string;
  pincode: string;
  ownerName: string;
  phone: string;
  email: string;
  selectedPlan: string;
  registeredAt: string;
  status: string;
}

let registeredBusinesses: RegisteredBusiness[] = [];

export async function POST(request: NextRequest) {
  try {
    const body: RegistrationPayload = await request.json();

    // Validation
    if (!body.businessName?.trim()) {
      return NextResponse.json(
        { error: true, message: "Business name is required" },
        { status: 400 }
      );
    }

    if (!body.gstNumber?.trim() || !/^[0-9A-Z]{15}$/.test(body.gstNumber)) {
      return NextResponse.json(
        { error: true, message: "Invalid GST number format" },
        { status: 400 }
      );
    }

    if (!body.businessType) {
      return NextResponse.json(
        { error: true, message: "Business type is required" },
        { status: 400 }
      );
    }

    if (!body.city?.trim() || !body.state || !body.pincode?.trim()) {
      return NextResponse.json(
        { error: true, message: "Location details are required" },
        { status: 400 }
      );
    }

    if (!body.ownerName?.trim()) {
      return NextResponse.json(
        { error: true, message: "Owner name is required" },
        { status: 400 }
      );
    }

    if (!body.phone?.trim() || !/^[0-9]{10}$/.test(body.phone)) {
      return NextResponse.json(
        { error: true, message: "Invalid phone number" },
        { status: 400 }
      );
    }

    if (!body.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json(
        { error: true, message: "Invalid email address" },
        { status: 400 }
      );
    }

    if (!body.password || body.password.length < 8) {
      return NextResponse.json(
        { error: true, message: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    if (!["Starter", "Professional", "Enterprise"].includes(body.selectedPlan)) {
      return NextResponse.json(
        { error: true, message: "Invalid plan selected" },
        { status: 400 }
      );
    }

    // Check for duplicate GST or email
    const existingBusiness = registeredBusinesses.find(
      (b) => b.gstNumber === body.gstNumber || b.email === body.email
    );

    if (existingBusiness) {
      return NextResponse.json(
        {
          error: true,
          message: "This GST number or email is already registered",
        },
        { status: 409 }
      );
    }

    // Create new registration
    const newBusiness: RegisteredBusiness = {
      id: `BIZ-${Date.now()}`,
      businessName: body.businessName,
      gstNumber: body.gstNumber,
      businessType: body.businessType,
      city: body.city,
      state: body.state,
      pincode: body.pincode,
      ownerName: body.ownerName,
      phone: body.phone,
      email: body.email,
      selectedPlan: body.selectedPlan,
      registeredAt: new Date().toISOString(),
      status: "Pending Verification",
    };

    registeredBusinesses.push(newBusiness);

    // Store in session/auth context would happen here
    // For now, we'll return the registration details
    return NextResponse.json(
      {
        success: true,
        message: "Registration successful! Your account is being verified.",
        business: {
          id: newBusiness.id,
          businessName: newBusiness.businessName,
          email: newBusiness.email,
          selectedPlan: newBusiness.selectedPlan,
          status: newBusiness.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: true, message: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      registeredCount: registeredBusinesses.length,
      businesses: registeredBusinesses,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}
