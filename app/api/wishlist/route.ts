import { NextRequest, NextResponse } from "next/server";

// Mock wishlist storage (in production, this would be a database)
const mockWishlist: Record<string, string[]> = {};

export async function GET(request: NextRequest) {
  try {
    // Get user ID from headers or auth context (mock implementation)
    const userId = request.headers.get("x-user-id") || "guest";

    const wishlist = mockWishlist[userId] || [];

    return NextResponse.json(
      {
        success: true,
        userId,
        items: wishlist,
        count: wishlist.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Wishlist fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { partId } = body;

    if (!partId) {
      return NextResponse.json(
        { error: "partId is required" },
        { status: 400 }
      );
    }

    const userId = request.headers.get("x-user-id") || "guest";

    if (!mockWishlist[userId]) {
      mockWishlist[userId] = [];
    }

    if (!mockWishlist[userId].includes(partId)) {
      mockWishlist[userId].push(partId);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Added to wishlist",
        partId,
        count: mockWishlist[userId].length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Wishlist add error:", error);
    return NextResponse.json(
      { error: "Failed to add to wishlist" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { partId } = body;

    if (!partId) {
      return NextResponse.json(
        { error: "partId is required" },
        { status: 400 }
      );
    }

    const userId = request.headers.get("x-user-id") || "guest";

    if (mockWishlist[userId]) {
      mockWishlist[userId] = mockWishlist[userId].filter(
        (id) => id !== partId
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Removed from wishlist",
        partId,
        count: mockWishlist[userId]?.length || 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Wishlist remove error:", error);
    return NextResponse.json(
      { error: "Failed to remove from wishlist" },
      { status: 500 }
    );
  }
}
