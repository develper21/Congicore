import Tesseract from 'tesseract.js';

/**
 * Extract text from images using OCR (Optical Character Recognition)
 */
export async function extractImageText(filePath: string): Promise<string> {
  try {
    const { data: { text } } = await Tesseract.recognize(filePath);
    return text;
  } catch (error) {
    console.error('OCR processing error:', error);
    throw new Error('Failed to extract text from image');
  }
}
