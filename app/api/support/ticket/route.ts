import { NextRequest, NextResponse } from "next/server";

interface TicketPayload {
  name: string;
  phone: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  partNeeded: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: TicketPayload = await request.json();

    // Validate required fields
    const { name, phone, vehicleMake, vehicleModel, vehicleYear, partNeeded, message } = body;

    if (!name || !phone || !vehicleMake || !vehicleModel || !vehicleYear || !partNeeded || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate phone format
    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { error: "Phone must be a valid 10-digit number" },
        { status: 400 }
      );
    }

    // Create ticket object
    const ticket = {
      id: `TKT-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      status: "open",
    };

    // TODO: In production, save to database
    // For now, log to console and return success
    console.log("Support Ticket Created:", ticket);

    // TODO: Send email notification to support team
    // sendEmailToSupport(ticket);

    return NextResponse.json(
      {
        success: true,
        ticketId: ticket.id,
        message: "Ticket created successfully. Our team will contact you soon.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating support ticket:", error);
    return NextResponse.json(
      { error: "Failed to create support ticket" },
      { status: 500 }
    );
  }
}
