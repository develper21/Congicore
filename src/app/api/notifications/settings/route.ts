import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";
import { scheduleNotificationJob } from "@/lib/notifications";

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In production, fetch user's notification settings from database
    // For now, return default settings
    const settings = {
      emailEnabled: false,
      email: "",
      reminderTime: "09:00",
      reminderDays: [1, 2, 3, 4, 5], // Monday to Friday
    };

    return NextResponse.json({ settings }, { status: 200 });
  } catch (error) {
    console.error("Notification settings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notification settings" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await request.json();

    // In production, save user's notification settings to database
    // For now, just acknowledge the update
    console.log(`[Notification Settings] Updated for user ${userId}:`, settings);

    // Schedule notification job based on settings
    if (settings.emailEnabled) {
      scheduleNotificationJob(userId, settings);
    }

    return NextResponse.json(
      { message: "Notification settings updated", settings },
      { status: 200 },
    );
  } catch (error) {
    console.error("Notification settings update error:", error);
    return NextResponse.json(
      { error: "Failed to update notification settings" },
      { status: 500 },
    );
  }
}
