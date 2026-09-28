import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { Graph } from "@/models";

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const importData = await request.json();

    if (!importData.nodes || !importData.edges) {
      return NextResponse.json(
        { error: "Invalid import data format" },
        { status: 400 },
      );
    }

    await connectDB();

    // Check if graph already exists
    const existingGraph = await Graph.findOne({ userId });

    if (existingGraph) {
      // Update existing graph
      existingGraph.nodes = importData.nodes;
      existingGraph.edges = importData.edges;
      existingGraph.updatedAt = new Date();
      await existingGraph.save();
    } else {
      // Create new graph
      await Graph.create({
        userId,
        nodes: importData.nodes,
        edges: importData.edges,
      });
    }

    return NextResponse.json(
      {
        message: "Knowledge graph imported successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Import knowledge graph error:", error);
    return NextResponse.json(
      { error: "Failed to import knowledge graph" },
      { status: 500 },
    );
  }
}
