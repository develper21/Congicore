import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Document } from "@/models";
import { getUserIdFromRequest } from "@/lib/auth";
import { processDocument } from "@/lib/document-processor";
import { autoTagDocument } from "@/lib/openai";
import { generateKnowledgeGraph } from "@/lib/graph-generator";
import { generateDocumentEmbedding } from "@/lib/embeddings";
import { uploadFileToS3, isS3Configured } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const tags = formData.get("tags") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileType = file.type.split("/")[1] || "unknown";
    const filesize = file.size;

    // Upload to S3 if configured, otherwise use local path
    let fileUrl: string;
    let s3Key: string | undefined;

    if (isS3Configured()) {
      const uploadResult = await uploadFileToS3(buffer, file.name, file.type);
      fileUrl = uploadResult.url;
      s3Key = uploadResult.key;
    } else {
      fileUrl = `/upload/${file.name}`;
      // In production, you'd save the file locally here
    }

    // Create document record with processing status
    const document = await Document.create({
      userId,
      title: title || file.name,
      type: fileType.toUpperCase(),
      size: filesize,
      fileUrl,
      thumbnail: "",
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      status: "processing",
      content: "",
    });

    // Process document in background (non-blocking)
    processDocumentInBackground(document._id.toString(), file, fileUrl, userId);

    return NextResponse.json(
      {
        message: "File uploaded successfully, processing started",
        document,
        fileUrl,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * Background processing function
 * Processes document, extracts content, auto-tags, and generates knowledge graph
 */
async function processDocumentInBackground(documentId: string, file: File, fileUrl: string, userId: string) {
  try {
    await connectDB();

    // Process document to extract content
    const processed = await processDocument(file, fileUrl);

    // Auto-tag using AI
    const aiTags = await autoTagDocument(processed.text, file.name);

    // Update document with processed content
    await Document.findByIdAndUpdate(documentId, {
      content: processed.text,
      status: "processed",
      processedAt: new Date(),
      tags: aiTags,
    });

    // Generate knowledge graph from document
    if (processed.text) {
      await generateKnowledgeGraph(
        userId,
        documentId,
        processed.text,
        file.name
      );

      // Generate embedding for semantic search
      try {
        const embedding = await generateDocumentEmbedding(processed.text);
        await Document.findByIdAndUpdate(documentId, { embedding });
      } catch (embeddingError) {
        console.error(`Embedding generation error for document ${documentId}:`, embeddingError);
        // Don't fail the entire process if embedding generation fails
      }
    }

    console.log(`Document ${documentId} processed successfully`);
  } catch (error) {
    console.error(`Background processing error for document ${documentId}:`, error);
    
    // Update document status to failed
    await Document.findByIdAndUpdate(documentId, {
      status: "failed",
    });
  }
}
