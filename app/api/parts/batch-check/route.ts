import { NextResponse } from "next/server";
import { mockProducts } from "@/lib/mockData";

interface StockCheckRequest {
  partIds: string[];
}

interface StockInfo {
  partId: string;
  name: string;
  brand: string;
  currentPrice: number;
  originalPrice: number;
  inStock: boolean;
  stockCount: number;
}

export async function POST(request: Request) {
  try {
    const { partIds } = (await request.json()) as StockCheckRequest;

    if (!Array.isArray(partIds) || partIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid or missing partIds array" },
        { status: 400 }
      );
    }

    const stockInfo: StockInfo[] = partIds.map((partId) => {
      const product = mockProducts.find((p) => p.id === partId);

      if (!product) {
        return {
          partId,
          name: "Unknown",
          brand: "Unknown",
          currentPrice: 0,
          originalPrice: 0,
          inStock: false,
          stockCount: 0,
        };
      }

      return {
        partId,
        name: product.name,
        brand: product.brand,
        currentPrice: product.price,
        originalPrice: product.originalPrice,
        inStock: product.inStock && product.stockCount > 0,
        stockCount: product.stockCount,
      };
    });

    return NextResponse.json({ items: stockInfo });
  } catch (error) {
    console.error("Batch stock check error:", error);
    return NextResponse.json(
      { error: "Failed to check stock" },
      { status: 500 }
    );
  }
}
