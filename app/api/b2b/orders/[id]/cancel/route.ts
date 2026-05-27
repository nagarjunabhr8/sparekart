import { NextResponse } from "next/server";
import { mockOrders } from "@/lib/mockOrders";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(
  request: Request,
  context: RouteContext
) {
  const params = await context.params;
  try {
    const orderId = params.id;
    const order = mockOrders.find((o) => o.id === orderId);

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Check if order can be cancelled
    const canBeCancelled = ["pending", "confirmed"].includes(order.status);
    if (!canBeCancelled) {
      return NextResponse.json(
        {
          error: `Order cannot be cancelled when status is ${order.status}`,
          currentStatus: order.status,
        },
        { status: 400 }
      );
    }

    // Update order status to cancelled
    order.status = "cancelled";

    // Add cancellation event to timeline
    if (order.timeline) {
      order.timeline.push({
        id: `evt_${Date.now()}`,
        event: "Order Cancelled",
        timestamp: new Date().toISOString(),
        status: "cancelled",
        description: "Order has been cancelled by the customer",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Order cancelled successfully",
      orderId,
      orderNumber: order.orderNumber,
      newStatus: order.status,
    });
  } catch (error) {
    console.error("Order cancellation error:", error);
    return NextResponse.json(
      { error: "Failed to cancel order" },
      { status: 500 }
    );
  }
}
