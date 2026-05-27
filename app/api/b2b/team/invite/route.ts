import { NextResponse } from "next/server";

interface InvitePayload {
  email: string;
  role: "Owner" | "Manager" | "Purchaser" | "Viewer";
  spendLimitPerOrder?: number;
  spendLimitPerMonth?: number;
}

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

// Mock plan limits
const PLAN_LIMITS: Record<string, number> = {
  Starter: 2,
  Professional: 10,
  Enterprise: 999,
};

export async function POST(request: Request) {
  try {
    const body: InvitePayload = await request.json();

    // Validate email
    if (!body.email?.trim()) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate role
    if (!["Owner", "Manager", "Purchaser", "Viewer"].includes(body.role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    const businessId = "biz_default";
    const members = teamMembersDatabase[businessId] || [];

    // Check if email already exists
    if (members.some((m) => m.email === body.email)) {
      return NextResponse.json(
        { error: "Member with this email already exists" },
        { status: 400 }
      );
    }

    // Check team size limit (mock plan is Professional with limit of 10)
    if (members.length >= PLAN_LIMITS["Professional"]) {
      return NextResponse.json(
        { error: "Team size limit reached" },
        { status: 400 }
      );
    }

    // Create new team member
    const newMember: TeamMember = {
      id: Date.now().toString(),
      businessId,
      name: body.email.split("@")[0],
      email: body.email,
      role: body.role,
      status: "pending",
      spendLimitPerOrder: body.spendLimitPerOrder,
      spendLimitPerMonth: body.spendLimitPerMonth,
    };

    if (!teamMembersDatabase[businessId]) {
      teamMembersDatabase[businessId] = [];
    }

    teamMembersDatabase[businessId].push(newMember);

    // In production: send invitation email here
    // await sendInvitationEmail(body.email, businessId, body.role);

    return NextResponse.json(
      {
        success: true,
        message: "Invitation sent successfully",
        member: newMember,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Team invite error:", error);
    return NextResponse.json(
      { error: "Failed to send invitation" },
      { status: 500 }
    );
  }
}
