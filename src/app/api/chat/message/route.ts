import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Chat } from "@/models";
import { getUserIdFromRequest } from "@/lib/auth";
import { ragResponse } from "@/lib/rag";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { chatId, message } = body;

    // Validation
    if (!chatId || !message) {
      return NextResponse.json(
        { error: "chatId and message are required" },
        { status: 400 },
      );
    }

    // Get chat
    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Add user message to chat
    chat.messages.push({
      role: "user",
      content: message,
      timestamp: new Date(),
    });

    // Convert chat messages to OpenAI format
    const chatMessages = chat.messages
      .slice(-10) // Last 10 messages for context
      .map((msg: { role: string; content: string }) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

    // Generate AI response using RAG pipeline
    const aiResponse = await ragResponse(userId, message, chatMessages);

    // Add AI response to chat
    chat.messages.push({
      role: "assistant",
      content: aiResponse.content,
      timestamp: new Date(),
    });

    chat.updatedAt = new Date();
    await chat.save();

    return NextResponse.json(
      {
        message: "Message sent successfully",
        response: aiResponse.content,
        sources: aiResponse.sources,
        chat,
        usage: aiResponse.usage,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Chat message error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
