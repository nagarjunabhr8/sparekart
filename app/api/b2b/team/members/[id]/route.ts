import { NextResponse } from "next/server";

interface TeamMember {
  id: string;
  businessId: string;
  name: string;
  email: string;
  role: "Owner" | "Manager" | "Purchaser" | "Viewer";
  status: "active" | "pending" | "suspended";
  joinedDate?: string;
  spendLimitPerOrder?: number;
  spendLimitPerMonth?: number;
}

interface RouteContext {
  params: Promise<{ id: string }>;
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
    },
    {
      id: "2",
      businessId: "biz_default",
      name: "Priya Sharma",
      email: "priya@techauto.com",
      role: "Manager",
      status: "active",
      joinedDate: "2024-02-20",
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

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const params = await context.params;
    const body = await request.json();
    const { role, status, spendLimitPerOrder, spendLimitPerMonth } = body;

    const businessId = "biz_default";
    const members = teamMembersDatabase[businessId] || [];

    const memberIndex = members.findIndex((m) => m.id === params.id);
    if (memberIndex === -1) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    const member = members[memberIndex];

    // Prevent changing Owner role
    if (member.role === "Owner" && role && role !== "Owner") {
      return NextResponse.json(
        { error: "Cannot change owner role" },
        { status: 400 }
      );
    }

    // Update fields if provided
    if (role && ["Owner", "Manager", "Purchaser", "Viewer"].includes(role)) {
      member.role = role;
    }

    if (status && ["active", "pending", "suspended"].includes(status)) {
      member.status = status;
    }

    if (spendLimitPerOrder !== undefined) {
      member.spendLimitPerOrder = spendLimitPerOrder;
    }

    if (spendLimitPerMonth !== undefined) {
      member.spendLimitPerMonth = spendLimitPerMonth;
    }

    members[memberIndex] = member;

    return NextResponse.json(
      {
        success: true,
        message: "Team member updated successfully",
        member,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Team member update error:", error);
    return NextResponse.json(
      { error: "Failed to update team member" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  try {
    const params = await context.params;
    const businessId = "biz_default";
    const members = teamMembersDatabase[businessId] || [];

    const memberIndex = members.findIndex((m) => m.id === params.id);
    if (memberIndex === -1) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    const member = members[memberIndex];

    // Prevent deleting Owner
    if (member.role === "Owner") {
      return NextResponse.json(
        { error: "Cannot remove owner from team" },
        { status: 400 }
      );
    }

    members.splice(memberIndex, 1);

    return NextResponse.json(
      {
        success: true,
        message: "Team member removed successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Team member deletion error:", error);
    return NextResponse.json(
      { error: "Failed to remove team member" },
      { status: 500 }
    );
  }
}
