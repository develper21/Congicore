import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { Document } from "@/models";

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const importData = await request.json();

    if (!importData.documents || !Array.isArray(importData.documents)) {
      return NextResponse.json(
        { error: "Invalid import data format" },
        { status: 400 },
      );
    }

    await connectDB();

    let importedCount = 0;
    let skippedCount = 0;

    for (const docData of importData.documents) {
      try {
        // Check if document already exists
        const existing = await Document.findOne({
          userId,
          title: docData.title,
          content: docData.content,
        });

        if (existing) {
          skippedCount++;
          continue;
        }

        // Create new document
        await Document.create({
          userId,
          title: docData.title,
          content: docData.content,
          summary: docData.summary,
          category: docData.category,
          tags: docData.tags,
          fileType: docData.fileType,
        });

        importedCount++;
      } catch (error) {
        console.error("Error importing document:", error);
        skippedCount++;
      }
    }

    return NextResponse.json(
      {
        message: "Import completed",
        importedCount,
        skippedCount,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Import documents error:", error);
    return NextResponse.json(
      { error: "Failed to import documents" },
      { status: 500 },
    );
  }
}
