import { NextRequest, NextResponse } from "next/server";

interface StockAlertRequest {
  partId: string;
  channel: "email" | "sms";
  contact: string;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: StockAlertRequest = await request.json();

    // Validate required fields
    if (!body.partId || !body.channel || !body.contact) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    if (body.channel === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.contact)) {
        return NextResponse.json(
          { error: "Invalid email format" },
          { status: 400 }
        );
      }
    }

    // Validate phone format
    if (body.channel === "sms") {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(body.contact)) {
        return NextResponse.json(
          { error: "Invalid phone format" },
          { status: 400 }
        );
      }
    }

    // Log the notification (in a real app, this would save to database)
    console.log(
      `[Stock Alert] Part: ${body.partId}, Channel: ${body.channel}, Contact: ${body.contact}, Time: ${body.timestamp}`
    );

    // Simulate sending notification
    if (body.channel === "email") {
      // In a real app, this would send an email via SendGrid, AWS SES, etc.
      console.log(`📧 Email would be sent to: ${body.contact}`);
    } else {
      // In a real app, this would send SMS via Twilio, AWS SNS, etc.
      console.log(`📱 SMS would be sent to: ${body.contact}`);
    }

    return NextResponse.json(
      {
        success: true,
        message: `Stock alert registered for part ${body.partId}`,
        alertId: `ALERT-${Date.now()}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Stock alert error:", error);
    return NextResponse.json(
      { error: "Failed to process stock alert" },
      { status: 500 }
    );
  }
}

// GET endpoint to check if user has an alert for a part
export async function GET(request: NextRequest) {
  try {
    const partId = request.nextUrl.searchParams.get("partId");
    const contact = request.nextUrl.searchParams.get("contact");

    if (!partId || !contact) {
      return NextResponse.json(
        { error: "Missing partId or contact" },
        { status: 400 }
      );
    }

    // In a real app, this would query the database
    return NextResponse.json({
      hasAlert: false,
      alertId: null,
    });
  } catch (error) {
    console.error("Check alert error:", error);
    return NextResponse.json(
      { error: "Failed to check alert" },
      { status: 500 }
    );
  }
}
