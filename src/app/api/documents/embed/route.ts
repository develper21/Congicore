import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Document } from "@/models";
import { getUserIdFromRequest } from "@/lib/auth";
import { generateDocumentEmbedding } from "@/lib/embeddings";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { documentId } = body;

    if (!documentId) {
      return NextResponse.json({ error: "documentId is required" }, { status: 400 });
    }

    // Get document
    const document = await Document.findOne({ _id: documentId, userId });
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Check if document has content
    if (!document.content || document.content.length === 0) {
      return NextResponse.json({ error: "Document has no content" }, { status: 400 });
    }

    // Generate embedding
    const embedding = await generateDocumentEmbedding(document.content);

    // Update document with embedding
    await Document.findByIdAndUpdate(documentId, { embedding });

    return NextResponse.json(
      {
        message: "Embedding generated successfully",
        documentId,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Embedding generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate embedding" },
      { status: 500 },
    );
  }
}
