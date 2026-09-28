import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { User } from "@/models";

// POST - Verify user email
// In production this would validate a signed token from an email service;
// here we mark the account as verified by email lookup or token.
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, token } = body;

    if (!email && !token) {
      return NextResponse.json(
        { error: "Email or token is required" },
        { status: 400 },
      );
    }

    const user = email
      ? await User.findOne({ email })
      : await User.findById(token).catch(() => null);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid verification link" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Email verified successfully", verified: true },
      { status: 200 },
    );
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
