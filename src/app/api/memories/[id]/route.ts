import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Memory } from "@/models";
import { getUserIdFromRequest } from "@/lib/auth";

// GET - Get single memory
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;

    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const memory = await Memory.findOne({
      _id: id,
      userId,
    });

    if (!memory) {
      return NextResponse.json({ error: "Memory not found" }, { status: 404 });
    }

    return NextResponse.json({ memory }, { status: 200 });
  } catch (error) {
    console.error("Get memory error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT - Update memory
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;

    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      content,
      category,
      importance,
      tags,
      relatedDocuments,
      retentionRate,
      lastReviewed,
    } = body;

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (category) updateData.category = category;
    if (importance) updateData.importance = importance;
    if (tags) updateData.tags = tags;
    if (relatedDocuments) updateData.relatedDocuments = relatedDocuments;
    if (retentionRate !== undefined) updateData.retentionRate = retentionRate;
    if (lastReviewed) updateData.lastReviewed = lastReviewed;

    const memory = await Memory.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true },
    );

    if (!memory) {
      return NextResponse.json({ error: "Memory not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Memory updated successfully", memory },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update memory error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE - Delete memory
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;

    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const memory = await Memory.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!memory) {
      return NextResponse.json({ error: "Memory not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Memory deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete memory error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
