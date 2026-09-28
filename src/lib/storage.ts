import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";

// ------------------------------------------------------------------
// Local file storage (replaces AWS S3)
// Files are written to <project>/public/uploads so they are directly
// served by Next.js at /uploads/<fileName>.
// ------------------------------------------------------------------

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export interface UploadResult {
  url: string;
  key: string;
}

/** Ensure the upload directory exists */
async function ensureUploadDir() {
  await mkdir(UPLOAD_DIR, { recursive: true });
}

/** Sanitize a filename: keep the base name, strip unsafe characters */
function sanitizeFileName(fileName: string): string {
  const base = path.basename(fileName);
  return base.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-120);
}

/**
 * Save a file to local uploads directory
 */
export async function uploadFile(
  file: Buffer,
  fileName: string,
  _contentType: string,
): Promise<UploadResult> {
  try {
    await ensureUploadDir();

    const safeName = sanitizeFileName(fileName);
    const key = `${Date.now()}-${safeName}`;
    const filePath = path.join(UPLOAD_DIR, key);

    await writeFile(filePath, file);

    // Publicly served by Next.js from /public
    const url = `/uploads/${key}`;

    return { url, key };
  } catch (error) {
    console.error("Local file upload error:", error);
    throw new Error("Failed to save file locally");
  }
}

/**
 * Delete a locally stored file by its key
 */
export async function deleteFile(key: string): Promise<void> {
  try {
    // Only delete files that are inside the uploads directory
    const filePath = path.join(UPLOAD_DIR, path.basename(key));
    await unlink(filePath);
  } catch (error) {
    // Missing file is fine — treat as already deleted
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error("Local file delete error:", error);
      throw new Error("Failed to delete local file");
    }
  }
}

/**
 * Get the public URL for a stored file key
 */
export function getFileUrl(key: string): string {
  return `/uploads/${path.basename(key)}`;
}

export { UPLOAD_DIR };
