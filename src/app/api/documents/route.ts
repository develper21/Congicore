import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Document } from "@/models";
import { getUserIdFromRequest } from "@/lib/auth";

// GET - List all documents for a user
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    let query: any = { userId };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (type) {
      query.type = type;
    }

    if (status) {
      query.status = status;
    }

    const documents = await Document.find(query).sort({ uploadedAt: -1 });

    return NextResponse.json({ documents }, { status: 200 });
  } catch (error) {
    console.error("Get documents error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST - Create a new document
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, type, size, fileUrl, thumbnail, tags, content } = body;

    // Validation
    if (!title || !type || !size || !fileUrl) {
      return NextResponse.json(
        { error: "Required fields: title, type, size, fileUrl" },
        { status: 400 },
      );
    }

    const document = await Document.create({
      userId,
      title,
      type,
      size,
      fileUrl,
      thumbnail: thumbnail || "",
      tags: tags || [],
      content: content || "",
      status: "processing",
    });

    return NextResponse.json(
      { message: "Document created successfully", document },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create document error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
