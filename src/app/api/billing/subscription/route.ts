import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User, Subscription } from "@/models";
import { getUserIdFromRequest } from "@/lib/auth";

// GET - Get subscription details
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = await Subscription.findOne({ userId });

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ subscription }, { status: 200 });
  } catch (error) {
    console.error("Get subscription error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT - Update subscription (cancel/change plan)
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, plan } = body;

    if (action === "cancel") {
      // Cancel subscription
      await Subscription.findOneAndUpdate(
        { userId },
        { status: "cancelled" },
        { new: true },
      );

      await User.findByIdAndUpdate(userId, {
        "subscription.status": "cancelled",
      });

      return NextResponse.json(
        { message: "Subscription cancelled successfully" },
        { status: 200 },
      );
    }

    if (action === "change" && plan) {
      // Change plan
      const subscription = await Subscription.findOneAndUpdate(
        { userId },
        { plan },
        { new: true },
      );

      await User.findByIdAndUpdate(userId, {
        "subscription.plan": plan,
      });

      return NextResponse.json(
        { message: "Plan changed successfully", subscription },
        { status: 200 },
      );
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Update subscription error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
