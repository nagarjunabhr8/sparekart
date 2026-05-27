import { NextResponse } from "next/server";

interface TeamMember {
  id: string;
  businessId: string;
  name: string;
  email: string;
  role: "Owner" | "Manager" | "Purchaser" | "Viewer";
  status: "active" | "pending" | "suspended";
  joinedDate?: string;
  lastActive?: string;
  spendLimitPerOrder?: number;
  spendLimitPerMonth?: number;
}

// Mock team members database
const teamMembersDatabase: Record<string, TeamMember[]> = {
  biz_default: [
    {
      id: "1",
      businessId: "biz_default",
      name: "Rajesh Kumar",
      email: "rajesh@techauto.com",
      role: "Owner",
      status: "active",
      joinedDate: "2024-01-15",
      lastActive: new Date(Date.now() - 60000).toISOString(),
    },
    {
      id: "2",
      businessId: "biz_default",
      name: "Priya Sharma",
      email: "priya@techauto.com",
      role: "Manager",
      status: "active",
      joinedDate: "2024-02-20",
      lastActive: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "3",
      businessId: "biz_default",
      name: "Amit Patel",
      email: "amit@techauto.com",
      role: "Purchaser",
      status: "pending",
      spendLimitPerOrder: 500000,
      spendLimitPerMonth: 2000000,
    },
  ],
};

export async function GET(request: Request) {
  try {
    const businessId = "biz_default";
    const members = teamMembersDatabase[businessId] || [];

    return NextResponse.json(
      {
        success: true,
        members,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Team members fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}
