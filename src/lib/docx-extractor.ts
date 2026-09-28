import mammoth from 'mammoth';
import fs from 'fs';

/**
 * Extract text from DOCX file
 */
export async function extractDOCXText(filePath: string): Promise<string> {
  try {
    const buffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error('DOCX extraction error:', error);
    throw new Error('Failed to extract text from DOCX');
  }
}
