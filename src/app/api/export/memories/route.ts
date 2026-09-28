import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { Memory } from "@/models";

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const memories = await Memory.find({ userId });

    const exportData = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      memories: memories.map((mem) => ({
        id: mem._id,
        title: mem.title,
        content: mem.content,
        category: mem.category,
        tags: mem.tags,
        createdAt: mem.createdAt,
        lastReviewed: mem.lastReviewed,
        nextReview: mem.nextReview,
        retentionRate: mem.retentionRate,
        easeFactor: mem.easeFactor,
        interval: mem.interval,
      })),
    };

    return NextResponse.json(exportData, { status: 200 });
  } catch (error) {
    console.error("Export memories error:", error);
    return NextResponse.json(
      { error: "Failed to export memories" },
      { status: 500 },
    );
  }
}
