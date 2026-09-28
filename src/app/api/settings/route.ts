import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/models";
import { getUserIdFromRequest } from "@/lib/auth";

// GET - Get user settings
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId).select("settings");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ settings: user.settings }, { status: 200 });
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT - Update user settings
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { notification, notifications, privacy, ai, appearance } = body;

    const updateData: any = {};

    // Accept both `notification` (schema shape) and `notifications` (page shape)
    const notifPayload = notification || notifications;
    if (notifPayload) {
      updateData["settings.notification"] = notifPayload;
    }

    if (privacy) {
      updateData["settings.privacy"] = privacy;
    }

    if (ai) {
      updateData["settings.ai"] = ai;
    }

    if (appearance) {
      updateData["settings.appearance"] = appearance;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true },
    ).select("settings");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Settings updated successfully", settings: user.settings },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
