import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Document } from "@/models";
import { getUserIdFromRequest } from "@/lib/auth";
import { summarizeDocument } from "@/lib/openai";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get document
    const document = await Document.findOne({ _id: id, userId });
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Check if document has content
    if (!document.content || document.content.length === 0) {
      return NextResponse.json({ error: "Document has no content" }, { status: 400 });
    }

    // Generate summary using AI
    const summary = await summarizeDocument(document.content);

    // Update document with summary
    const updatedDocument = await Document.findByIdAndUpdate(
      id,
      { summary },
      { new: true }
    );

    return NextResponse.json(
      {
        message: "Summary generated successfully",
        summary,
        document: updatedDocument,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Summarize error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
