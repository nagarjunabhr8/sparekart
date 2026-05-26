import { NextRequest, NextResponse } from "next/server";

interface WishlistAddRequest {
  partId: string;
  productData?: Record<string, unknown>;
}

// Mock wishlist storage (in production, this would be a database)
const mockWishlist: Record<string, string[]> = {};

export async function POST(request: NextRequest) {
  try {
    const body: WishlistAddRequest = await request.json();

    if (!body.partId) {
      return NextResponse.json(
        { error: "partId is required" },
        { status: 400 }
      );
    }

    // Get user ID from headers or auth context (mock implementation)
    const userId = request.headers.get("x-user-id") || "guest";

    if (!mockWishlist[userId]) {
      mockWishlist[userId] = [];
    }

    // Check if already in wishlist
    if (mockWishlist[userId].includes(body.partId)) {
      return NextResponse.json(
        {
          success: true,
          message: "Product already in wishlist",
          partId: body.partId,
        },
        { status: 200 }
      );
    }

    // Add to wishlist
    mockWishlist[userId].push(body.partId);

    console.log(`[Wishlist] Added part ${body.partId} to user ${userId}'s wishlist`);

    return NextResponse.json(
      {
        success: true,
        message: "Product added to wishlist",
        partId: body.partId,
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
