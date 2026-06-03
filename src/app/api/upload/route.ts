import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Document } from "@/models";
import { getUserIdFromRequest } from "@/lib/auth";

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
    const fileUrl = `/upload/${file.name}`;
    const fileType = file.type.split("/")[1] || "unknown";
    const filesize = file.size;

    const document = await Document.create({
      userId,
      title: title || file.name,
      type: fileType.toUpperCase(),
      size: filesize,
      fileUrl,
      thumbnail: "",
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      status: "processing",
    });

    return NextResponse.json(
      {
        message: "File uploaded successfully",
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
