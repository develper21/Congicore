import pdf from 'pdf-parse';
import fs from 'fs';

export interface PDFExtractionResult {
  text: string;
  pages: number;
}

/**
 * Extract text from PDF file
 */
export async function extractPDFText(filePath: string): Promise<PDFExtractionResult> {
  try {
    const buffer = fs.readFileSync(filePath);
    const data = await pdf(buffer);
    
    return {
      text: data.text,
      pages: data.numpages,
    };
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}
