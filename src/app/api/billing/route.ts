import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import { User, Subscription } from "@/models";
import { getUserIdFromRequest } from "@/lib/auth";

// GET - Billing overview: current plan + invoice history
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId).select("subscription");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const subscriptions = await Subscription.find({ userId }).sort({
      createdAt: -1,
    });

    // Map subscription records into an invoice-style history
    const billingHistory = subscriptions.map((sub) => ({
      id: sub._id.toString(),
      description: `${sub.plan === "free" ? "Free" : sub.plan === "pro" ? "Pro Twin" : "Team & Lab"} Plan (${sub.cycle})`,
      amount: sub.amount || 0,
      date: sub.startDate || sub.createdAt,
      status: sub.status,
    }));

    return NextResponse.json(
      {
        billing: {
          currentPlan: user.subscription?.plan || "free",
          status: user.subscription?.status || "active",
          storageUsed: user.subscription?.storageUsed || 0,
          storageLimit: user.subscription?.storageLimit || 0,
        },
        billingHistory,
        subscriptionDetails: subscriptions[0] || null,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get billing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
