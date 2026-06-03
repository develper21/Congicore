import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Graph } from "@/models";
import { getUserIdFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const graph = await Graph.findOne({ userId });
    if (!graph) {
      const newGraph = await Graph.create({
        userId,
        nodes: [],
        edges: [],
      });
      return NextResponse.json({ graph: newGraph }, { status: 200 });
    }
    return NextResponse.json({ graph }, { status: 200 });
  } catch (error) {
    console.error("Get graph error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { nodes, edges } = body;

    const graph = await Graph.findOneAndUpdate(
      { userId },
      {
        nodes: nodes || [],
        edges: edges || [],
        updatedAt: new Date(),
      },
      { upsert: true, new: true },
    );
    return NextResponse.json(
      { message: "Graph updatedAt successful", graph },
      { status: 200 },
    );
  } catch (error) {
    console.error("Put graph error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
