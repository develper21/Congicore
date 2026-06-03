import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/models";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          message:
            "If the email exists, a password reset link will be sent to you",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        message:
          "If the email exists, a password reset link will be sent to you",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
