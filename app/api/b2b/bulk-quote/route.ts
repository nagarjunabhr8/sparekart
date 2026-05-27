import { NextRequest, NextResponse } from "next/server";

interface BulkQuotePart {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
}

interface BulkQuoteRequest {
  parts: BulkQuotePart[];
  deliveryDate: string;
  address: string;
  specialInstructions: string;
  paymentMethod: string;
  gstInvoice: boolean;
  gstNumber: string | null;
  userPlan: "Starter" | "Professional" | "Enterprise";
}

// Mock storage (replace with database in production)
const quoteRequests: Record<string, any> = {};
let quoteCounter = 1000;

export async function POST(req: NextRequest) {
  try {
    const body: BulkQuoteRequest = await req.json();

    // Validation
    if (!body.parts || body.parts.length === 0) {
      return NextResponse.json(
        { success: false, message: "Please add at least one part" },
        { status: 400 }
      );
    }

    if (!body.deliveryDate) {
      return NextResponse.json(
        { success: false, message: "Delivery date is required" },
        { status: 400 }
      );
    }

    if (!body.address) {
      return NextResponse.json(
        { success: false, message: "Delivery address is required" },
        { status: 400 }
      );
    }

    // Generate quote ID
    const quoteId = `BQ-${String(quoteCounter++).padStart(5, "0")}`;

    // Calculate totals
    const subtotal = body.parts.reduce(
      (sum, part) => sum + part.price * part.quantity,
      0
    );
    const discountRate =
      body.userPlan === "Professional"
        ? 0.15
        : body.userPlan === "Enterprise"
          ? 0.25
          : 0.05;
    const discount = subtotal * discountRate;
    const afterDiscount = subtotal - discount;
    const gst = afterDiscount * 0.18;
    const total = afterDiscount + gst;

    // Store quote request
    const quoteRequest = {
      id: quoteId,
      parts: body.parts,
      deliveryDate: body.deliveryDate,
      address: body.address,
      specialInstructions: body.specialInstructions,
      paymentMethod: body.paymentMethod,
      gstInvoice: body.gstInvoice,
      gstNumber: body.gstNumber,
      userPlan: body.userPlan,
      subtotal,
      discount,
      afterDiscount,
      gst,
      total,
      status: "pending",
      createdAt: new Date().toISOString(),
      accountManagerAssigned: body.userPlan === "Enterprise",
      accountManagerName:
        body.userPlan === "Enterprise"
          ? `Manager_${Math.floor(Math.random() * 1000)}`
          : null,
    };

    quoteRequests[quoteId] = quoteRequest;

    // In production, you would:
    // 1. Save to database
    // 2. Send confirmation email
    // 3. Notify account manager if Enterprise
    // 4. Create backend task for quote processing

    return NextResponse.json({
      success: true,
      message: "Bulk quote request received. Our team will respond within 4 business hours.",
      quoteId,
      quote: quoteRequest,
    });
  } catch (error) {
    console.error("Bulk quote error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit bulk quote" },
      { status: 500 }
    );
  }
}

export async function GET(_req: NextRequest) {
  try {
    // In production, fetch from database filtered by user
    // For now, return mock data
    const quotes = Object.values(quoteRequests).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      success: true,
      quotes,
      total: quotes.length,
    });
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch quotes" },
      { status: 500 }
    );
  }
}
