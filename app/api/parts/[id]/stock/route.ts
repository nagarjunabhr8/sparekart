import { NextRequest, NextResponse } from "next/server";

interface StockData {
  partId: string;
  qty: number;
  expectedDate?: string;
  lastUpdated: string;
}

// Mock stock data - in a real app, this would query a database
const mockStockData: Record<string, StockData> = {
  "PART-001": {
    partId: "PART-001",
    qty: 25,
    lastUpdated: new Date().toISOString(),
  },
  "PART-002": {
    partId: "PART-002",
    qty: 3,
    lastUpdated: new Date().toISOString(),
  },
  "PART-003": {
    partId: "PART-003",
    qty: 0,
    expectedDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    lastUpdated: new Date().toISOString(),
  },
  "PART-004": {
    partId: "PART-004",
    qty: 15,
    lastUpdated: new Date().toISOString(),
  },
  "PART-005": {
    partId: "PART-005",
    qty: 7,
    lastUpdated: new Date().toISOString(),
  },
};

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const partId = id;

    // Get stock data
    const stock = mockStockData[partId];

    if (!stock) {
      // Return default stock data for unknown parts
      return NextResponse.json(
        {
          partId,
          qty: 0,
          expectedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          lastUpdated: new Date().toISOString(),
          message: "Part not found, using default stock info",
        },
        { status: 200 }
      );
    }

    // Randomly decrease qty to simulate real-time stock changes
    const randomQty = Math.max(0, stock.qty - Math.floor(Math.random() * 2));

    return NextResponse.json(
      {
        ...stock,
        qty: randomQty,
        lastUpdated: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Stock fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stock information" },
      { status: 500 }
    );
  }
}
