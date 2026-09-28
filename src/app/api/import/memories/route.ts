import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { Memory } from "@/models";

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const importData = await request.json();

    if (!importData.memories || !Array.isArray(importData.memories)) {
      return NextResponse.json(
        { error: "Invalid import data format" },
        { status: 400 },
      );
    }

    await connectDB();

    let importedCount = 0;
    let skippedCount = 0;

    for (const memData of importData.memories) {
      try {
        // Check if memory already exists
        const existing = await Memory.findOne({
          userId,
          title: memData.title,
          content: memData.content,
        });

        if (existing) {
          skippedCount++;
          continue;
        }

        // Create new memory
        await Memory.create({
          userId,
          title: memData.title,
          content: memData.content,
          category: memData.category,
          tags: memData.tags,
          lastReviewed: memData.lastReviewed,
          nextReview: memData.nextReview,
          retentionRate: memData.retentionRate,
          easeFactor: memData.easeFactor,
          interval: memData.interval,
        });

        importedCount++;
      } catch (error) {
        console.error("Error importing memory:", error);
        skippedCount++;
      }
    }

    return NextResponse.json(
      {
        message: "Import completed",
        importedCount,
        skippedCount,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Import memories error:", error);
    return NextResponse.json(
      { error: "Failed to import memories" },
      { status: 500 },
    );
  }
}
