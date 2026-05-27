import { NextResponse } from "next/server";

// Mock database of registered emails
const registeredEmails = new Set<string>();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if email is already registered
    const available = !registeredEmails.has(email);

    return NextResponse.json(
      {
        email,
        available,
        message: available
          ? "Email is available for registration"
          : "Email is already registered",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email check error:", error);
    return NextResponse.json(
      { error: "Failed to check email availability" },
      { status: 500 }
    );
  }
}
