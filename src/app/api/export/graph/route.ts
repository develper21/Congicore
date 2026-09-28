import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { Graph } from "@/models";

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const graph = await Graph.findOne({ userId });

    if (!graph) {
      return NextResponse.json(
        { error: "Knowledge graph not found" },
        { status: 404 },
      );
    }

    const exportData = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      nodes: graph.nodes,
      edges: graph.edges,
    };

    return NextResponse.json(exportData, { status: 200 });
  } catch (error) {
    console.error("Export knowledge graph error:", error);
    return NextResponse.json(
      { error: "Failed to export knowledge graph" },
      { status: 500 },
    );
  }
}
