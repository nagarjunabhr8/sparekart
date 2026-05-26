import { NextRequest, NextResponse } from "next/server";

export interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  createdAt: string;
  lastUpdated: string;
  description: string;
}

let mockTickets: Ticket[] = [
  {
    id: "TKT-240515001",
    subject: "Delivery delay on order #ORD-12345",
    category: "Order Issue",
    status: "In Progress",
    createdAt: "2024-05-15",
    lastUpdated: "2024-05-23",
    description: "Parts were supposed to arrive on May 20th but still not received",
  },
  {
    id: "TKT-240512001",
    subject: "Invoice GST discrepancy",
    category: "Billing",
    status: "Resolved",
    createdAt: "2024-05-12",
    lastUpdated: "2024-05-22",
    description: "GST amount on invoice ORD-12340 doesn't match the calculation",
  },
  {
    id: "TKT-240510001",
    subject: "Part compatibility clarification",
    category: "Technical Support",
    status: "Open",
    createdAt: "2024-05-10",
    lastUpdated: "2024-05-23",
    description: "Need confirmation if part XYZ is compatible with Maruti Swift 2020",
  },
];

export async function GET() {
  try {
    return NextResponse.json(mockTickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, subject, description } = body;

    if (!subject || !description) {
      return NextResponse.json(
        { error: "Subject and description are required" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString().split("T")[0];
    const newTicket: Ticket = {
      id: `TKT-${Date.now()}`,
      subject,
      category: category || "General",
      status: "Open",
      createdAt: now,
      lastUpdated: now,
      description,
    };

    mockTickets.unshift(newTicket);

    return NextResponse.json(newTicket, { status: 201 });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { error: "Failed to create ticket" },
      { status: 500 }
    );
  }
}
