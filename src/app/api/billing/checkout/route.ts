import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User, Subscription } from "@/models";
import { getUserIdFromRequest } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { plan, cycle } = body;

    // Validation
    if (!plan || !cycle) {
      return NextResponse.json(
        { error: "Plan and cycle are required" },
        { status: 400 },
      );
    }

    // In a real app, you would integrate with Stripe here
    // For now, we'll simulate the checkout process

    const pricing = {
      pro: { monthly: 20, yearly: 200 },
      enterprise: { monthly: 50, yearly: 500 },
    };

    const amount =
      pricing[plan as keyof typeof pricing]?.[
        cycle as keyof (typeof pricing)[typeof plan]
      ] || 0;

    // Create subscription record
    const subscription = await Subscription.create({
      userId,
      plan,
      cycle,
      amount,
      currency: "USD",
      status: "active",
      startDate: new Date(),
      endDate:
        cycle === "yearly"
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    // Update user subscription
    await User.findByIdAndUpdate(userId, {
      "subscription.plan": plan,
      "subscription.status": "active",
      "subscription.storageLimit":
        plan === "enterprise" ? 53687091200 : 107374182400, // 50GB or 100GB
    });

    return NextResponse.json(
      {
        message: "Checkout successful",
        subscription,
        checkoutUrl: "#", // In real app, this would be Stripe checkout URL
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
