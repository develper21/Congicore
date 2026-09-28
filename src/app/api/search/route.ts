import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";
import { hybridSearch } from "@/lib/vector-search";

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!query) {
      return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
    }

    // Perform hybrid search (keyword + semantic)
    const results = await hybridSearch(userId, query, limit);

    return NextResponse.json(
      {
        query,
        results,
        count: results.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 },
    );
  }
}
