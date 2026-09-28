import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { Document } from "@/models";

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const documents = await Document.find({ userId });

    const exportData = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      documents: documents.map((doc) => ({
        id: doc._id,
        title: doc.title,
        content: doc.content,
        summary: doc.summary,
        category: doc.category,
        tags: doc.tags,
        fileType: doc.fileType,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      })),
    };

    return NextResponse.json(exportData, { status: 200 });
  } catch (error) {
    console.error("Export documents error:", error);
    return NextResponse.json(
      { error: "Failed to export documents" },
      { status: 500 },
    );
  }
}
