import { extractPDFText } from './pdf-extractor';
import { extractDOCXText } from './docx-extractor';
import { transcribeAudio } from './audio-transcriber';
import { transcribeVideo } from './video-transcriber';
import { extractImageText } from './ocr-processor';

export interface ProcessedContent {
  text: string;
  metadata: {
    type: string;
    pages?: number;
    duration?: number;
    wordCount: number;
  };
}

export interface DocumentMetadata {
  type: string;
  pages?: number;
  duration?: number;
  wordCount: number;
}

/**
 * Main document processing pipeline
 * Routes to appropriate extractor based on file type
 */
export async function processDocument(
  file: File,
  filePath: string
): Promise<ProcessedContent> {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  try {
    let text = '';
    const metadata: DocumentMetadata = {
      type: fileType,
      wordCount: 0,
    };

    // PDF files
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      const result = await extractPDFText(filePath);
      text = result.text;
      metadata.pages = result.pages;
    }
    // DOCX files
    else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.docx')
    ) {
      text = await extractDOCXText(filePath);
    }
    // Audio files
    else if (fileType.startsWith('audio/') || fileName.match(/\.(mp3|wav|m4a|aac)$/)) {
      const result = await transcribeAudio(filePath);
      text = result.text;
      metadata.duration = result.duration;
    }
    // Video files
    else if (fileType.startsWith('video/') || fileName.match(/\.(mp4|avi|mov|mkv)$/)) {
      const result = await transcribeVideo(filePath);
      text = result.text;
      metadata.duration = result.duration;
    }
    // Image files (OCR)
    else if (fileType.startsWith('image/') || fileName.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
      text = await extractImageText(filePath);
    }
    // Plain text files
    else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      text = await file.text();
    }
    // Markdown files
    else if (fileName.endsWith('.md')) {
      text = await file.text();
    }
    else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }

    // Calculate word count
    metadata.wordCount = text.split(/\s+/).filter(word => word.length > 0).length;

    return {
      text,
      metadata,
    };
  } catch (error) {
    console.error('Document processing error:', error);
    throw new Error(`Failed to process document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Batch process multiple documents
 */
export async function processBatchDocuments(
  files: File[],
  filePaths: string[]
): Promise<ProcessedContent[]> {
  const results: ProcessedContent[] = [];
  
  for (let i = 0; i < files.length; i++) {
    try {
      const result = await processDocument(files[i], filePaths[i]);
      results.push(result);
    } catch (error) {
      console.error(`Failed to process ${files[i].name}:`, error);
      results.push({
        text: '',
        metadata: {
          type: files[i].type,
          wordCount: 0,
        },
      });
    }
  }
  
  return results;
}
