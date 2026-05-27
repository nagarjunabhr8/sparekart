import { NextResponse } from "next/server";

// Mock database of registered GST numbers
const registeredGSTs = new Set<string>();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const gst = searchParams.get("gst");

    if (!gst) {
      return NextResponse.json(
        { error: "GST number is required" },
        { status: 400 }
      );
    }

    // Validate GST format
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstRegex.test(gst)) {
      return NextResponse.json(
        { error: "Invalid GST format" },
        { status: 400 }
      );
    }

    // Check if GST is already registered
    const available = !registeredGSTs.has(gst);

    return NextResponse.json(
      {
        gst,
        available,
        message: available
          ? "GST is available for registration"
          : "GST is already registered",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GST check error:", error);
    return NextResponse.json(
      { error: "Failed to check GST availability" },
      { status: 500 }
    );
  }
}
