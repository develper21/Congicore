import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";
import { calculateLearningAnalytics, getLearningInsights } from "@/lib/learning-analytics";

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Calculate learning analytics
    const analytics = await calculateLearningAnalytics(userId);
    
    // Get learning insights
    const insights = await getLearningInsights(userId);

    return NextResponse.json(
      {
        analytics,
        insights,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Learning analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch learning analytics" },
      { status: 500 },
    );
  }
}
