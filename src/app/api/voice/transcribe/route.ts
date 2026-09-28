import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";
import { transcribeAudio } from "@/lib/audio-transcriber";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    // Save audio file temporarily
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempDir = join(process.cwd(), "temp");
    const fileName = `${Date.now()}.wav`;
    const filePath = join(tempDir, fileName);

    await writeFile(filePath, buffer);

    // Transcribe audio
    const result = await transcribeAudio(filePath);

    // Clean up temporary file
    await unlink(filePath);

    return NextResponse.json(
      {
        transcription: result.text,
        duration: result.duration,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Voice transcription error:", error);
    return NextResponse.json(
      { error: "Failed to transcribe audio" },
      { status: 500 },
    );
  }
}
