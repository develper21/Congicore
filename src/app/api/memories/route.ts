import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Memory } from "@/models";
import { getUserIdFromRequest } from "@/lib/auth";

// GET - List all memories for a user
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");

    let query: any = { userId };

    if (category) {
      query.category = category;
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    const memories = await Memory.find(query)
      .sort({ updatedAt: -1 })
      .limit(100);

    return NextResponse.json({ memories }, { status: 200 });
  } catch (error) {
    console.error("Get memories error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST - Create a new memory
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, category, importance, tags, relatedDocuments } =
      body;

    // Validation
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "Required fields: title, content, category" },
        { status: 400 },
      );
    }

    const memory = await Memory.create({
      userId,
      title,
      content,
      category,
      importance: importance || 5,
      tags: tags || [],
      relatedDocuments: relatedDocuments || [],
    });

    return NextResponse.json(
      { message: "Memory created successfully", memory },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create memory error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
