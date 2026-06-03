import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Document, Chat, Memory, Graph } from "@/models";
import { getUserIdFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get counts
    const documentCount = await Document.countDocuments({ userId });
    const chatCount = await Chat.countDocuments({ userId });
    const memoryCount = await Memory.countDocuments({ userId });

    // Get graph data
    const graph = await Graph.findOne({ userId });
    const nodeCount = graph?.nodes.length || 0;
    const edgeCount = graph?.edges.length || 0;

    // Get recent activity
    const recentDocuments = await Document.find({ userId })
      .sort({ uploadedAt: -1 })
      .limit(5)
      .select("title type uploadedAt status");

    const recentChats = await Chat.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select("title updatedAt");

    // Calculate storage usage
    const documents = await Document.find({ userId }).select("size");
    const totalStorageUsed = documents.reduce((sum, doc) => sum + doc.size, 0);

    return NextResponse.json(
      {
        stats: {
          totalDocuments: documentCount,
          aiConversations: chatCount,
          knowledgeGraphNodes: nodeCount,
          memoryRetention: 0,
          documentsThisWeek: 0,
          documentsThisMonth: 0,
        },
        recentActivity: {
          documents: recentDocuments,
          chats: recentChats,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
