import { NextRequest, NextResponse } from "next/server";

interface WishlistRemoveRequest {
  partId: string;
}

// Mock wishlist storage (in production, this would be a database)
const mockWishlist: Record<string, string[]> = {};

export async function DELETE(request: NextRequest) {
  try {
    const body: WishlistRemoveRequest = await request.json();

    if (!body.partId) {
      return NextResponse.json(
        { error: "partId is required" },
        { status: 400 }
      );
    }

    // Get user ID from headers or auth context (mock implementation)
    const userId = request.headers.get("x-user-id") || "guest";

    if (!mockWishlist[userId]) {
      return NextResponse.json(
        {
          success: true,
          message: "Product not in wishlist",
          partId: body.partId,
        },
        { status: 200 }
      );
    }

    // Remove from wishlist
    mockWishlist[userId] = mockWishlist[userId].filter(
      (id) => id !== body.partId
    );

    console.log(`[Wishlist] Removed part ${body.partId} from user ${userId}'s wishlist`);

    return NextResponse.json(
      {
        success: true,
        message: "Product removed from wishlist",
        partId: body.partId,
        count: mockWishlist[userId].length,
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
