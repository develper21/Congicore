import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Chat } from "@/models";
import { getUserIdFromRequest } from "@/lib/auth";

// GET - Get single chat
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();

    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chat = await Chat.findOne({
      _id: params.id,
      userId,
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json({ chat }, { status: 200 });
  } catch (error) {
    console.error("Get chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT - Update chat (add message)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();

    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { message, title } = body;

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (title) {
      updateData.title = title;
    }

    if (message) {
      updateData.$push = {
        messages: {
          role: message.role,
          content: message.content,
          timestamp: new Date(),
        },
      };
    }

    const chat = await Chat.findOneAndUpdate(
      { _id: params.id, userId },
      updateData,
      { new: true },
    );

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Chat updated successfully", chat },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE - Delete chat
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();

    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chat = await Chat.findOneAndDelete({
      _id: params.id,
      userId,
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Chat deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
