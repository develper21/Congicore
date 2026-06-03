import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import { User, Subscription } from "@/models";
import { getUserIdFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await User.findById(userId).select("subscriptions");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const subscriptions = await Subscription.findOne({ userId });

    return NextResponse.json(
      {
        subscription: user.subscription,
        subscriptionDetails: subscriptions,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get billing error:", error);
    return NextResponse.json(
      { error: "Internal server error:" },
      { status: 500 },
    );
  }
}
