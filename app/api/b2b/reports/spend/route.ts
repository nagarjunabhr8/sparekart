import { NextRequest, NextResponse } from "next/server";

interface SpendData {
  period: string;
  monthlyData: Array<{
    month: string;
    spent: number;
  }>;
  categoryData: Array<{
    name: string;
    value: number;
  }>;
  summary: {
    totalSpent: number;
    averageSpent: number;
    currentMonthSpent: number;
    trendPercentage: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "6m";

    // Mock data for different periods
    let monthlyData = [];
    let categoryData = [];

    if (period === "6m") {
      monthlyData = [
        { month: "Dec", spent: 28000 },
        { month: "Jan", spent: 32000 },
        { month: "Feb", spent: 45000 },
        { month: "Mar", spent: 38000 },
        { month: "Apr", spent: 52000 },
        { month: "May", spent: 48000 },
      ];
    } else if (period === "3m") {
      monthlyData = [
        { month: "Mar", spent: 38000 },
        { month: "Apr", spent: 52000 },
        { month: "May", spent: 48000 },
      ];
    } else if (period === "12m") {
      monthlyData = [
        { month: "Jun", spent: 25000 },
        { month: "Jul", spent: 30000 },
        { month: "Aug", spent: 28000 },
        { month: "Sep", spent: 35000 },
        { month: "Oct", spent: 42000 },
        { month: "Nov", spent: 38000 },
        { month: "Dec", spent: 28000 },
        { month: "Jan", spent: 32000 },
        { month: "Feb", spent: 45000 },
        { month: "Mar", spent: 38000 },
        { month: "Apr", spent: 52000 },
        { month: "May", spent: 48000 },
      ];
    }

    categoryData = [
      { name: "Engine Parts", value: 35 },
      { name: "Brakes", value: 20 },
      { name: "Electrical", value: 18 },
      { name: "Suspension", value: 15 },
      { name: "Others", value: 12 },
    ];

    const totalSpent = monthlyData.reduce((sum, item) => sum + item.spent, 0);
    const averageSpent = Math.round(totalSpent / monthlyData.length);
    const currentMonthSpent = monthlyData[monthlyData.length - 1]?.spent || 0;
    const previousMonthSpent = monthlyData[monthlyData.length - 2]?.spent || 0;
    const trendPercentage =
      previousMonthSpent > 0
        ? Math.round(((currentMonthSpent - previousMonthSpent) / previousMonthSpent) * 100)
        : 0;

    const response: SpendData = {
      period,
      monthlyData,
      categoryData,
      summary: {
        totalSpent,
        averageSpent,
        currentMonthSpent,
        trendPercentage,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching spend data:", error);
    return NextResponse.json(
      { error: "Failed to fetch spend data" },
      { status: 500 }
    );
  }
}
