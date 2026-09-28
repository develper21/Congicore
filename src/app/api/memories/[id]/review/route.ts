import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Memory } from "@/models";
import { getUserIdFromRequest } from "@/lib/auth";
import { calculateNextReview, getDifficultyLevel } from "@/lib/spaced-repetition";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { quality } = body;

    // Validation
    if (typeof quality !== "number" || quality < 0 || quality > 5) {
      return NextResponse.json(
        { error: "Quality must be a number between 0 and 5" },
        { status: 400 },
      );
    }

    // Get memory
    const memory = await Memory.findOne({ _id: id, userId });
    if (!memory) {
      return NextResponse.json({ error: "Memory not found" }, { status: 404 });
    }

    // Calculate next review using SM-2 algorithm
    const currentData = {
      easeFactor: memory.easeFactor || 2.5,
      interval: memory.interval || 1,
      repetitions: memory.repetitions || 0,
      nextReviewDate: memory.nextReview || new Date(),
    };

    const newCardData = calculateNextReview(quality, currentData);

    // Update memory with new SM-2 data
    const updatedMemory = await Memory.findByIdAndUpdate(
      id,
      {
        easeFactor: newCardData.easeFactor,
        interval: newCardData.interval,
        repetitions: newCardData.repetitions,
        nextReview: newCardData.nextReviewDate,
        lastReviewed: new Date(),
        difficulty: getDifficultyLevel(newCardData.easeFactor),
        updatedAt: new Date(),
      },
      { new: true }
    );

    return NextResponse.json(
      {
        message: "Memory reviewed successfully",
        memory: updatedMemory,
        nextReview: newCardData.nextReviewDate,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Memory review error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
