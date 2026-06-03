import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Chat } from "@/models";
import { getUserIdFromRequest } from "@/lib/auth";

// GET - List all chats for a user
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 }).limit(50);

    return NextResponse.json({ chats }, { status: 200 });
  } catch (error) {
    console.error("Get chats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST - Create a new chat
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, firstMessage } = body;

    // Validation
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const messages = firstMessage
      ? [
          {
            role: "user",
            content: firstMessage,
            timestamp: new Date(),
          },
        ]
      : [];

    const chat = await Chat.create({
      userId,
      title,
      messages,
    });

    return NextResponse.json(
      { message: "Chat created successfully", chat },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
