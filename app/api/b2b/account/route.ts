import { NextResponse } from "next/server";

// Mock account database
const accountDatabase: Record<string, any> = {
  biz_default: {
    businessId: "biz_default",
    businessName: "Demo Auto Parts",
    email: "demo@sparekart.com",
    status: "active",
    createdAt: "2024-01-01T00:00:00Z",
  },
};

export async function DELETE(request: Request) {
  try {
    // Get user ID from cookie or session (mock for now)
    const userId = "biz_default";

    // Check if account exists
    if (!accountDatabase[userId]) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    // Mark account as deleted instead of actually deleting
    // In production, use soft delete to preserve data for compliance
    accountDatabase[userId].status = "deleted";
    accountDatabase[userId].deletedAt = new Date().toISOString();

    // Clear auth cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "Account deleted successfully",
      },
      { status: 200 }
    );

    // Clear auth token cookie
    response.cookies.set("auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const userId = "biz_default";
    const account = accountDatabase[userId];

    if (!account) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        account,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Account fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch account" },
      { status: 500 }
    );
  }
}
