import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Subscription } from "@/models";
import { getUserIdFromRequest } from "@/lib/auth";

// POST - Verify a checkout session after payment (simulated Stripe flow).
// The frontend stores the checkout session id in localStorage before
// redirecting to /billing/success, which calls this endpoint.
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 },
      );
    }

    // Find the latest active subscription for this user (created at checkout)
    const subscription = await Subscription.findOne({
      userId,
      status: "active",
    }).sort({ createdAt: -1 });

    if (!subscription) {
      return NextResponse.json(
        { error: "No active subscription found for this session" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        subscription,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
