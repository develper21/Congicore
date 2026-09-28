import openai from './openai';
import fs from 'fs';

export interface AudioTranscriptionResult {
  text: string;
  duration: number;
}

/**
 * Transcribe audio file using OpenAI Whisper
 */
export async function transcribeAudio(filePath: string): Promise<AudioTranscriptionResult> {
  try {
    const file = fs.createReadStream(filePath);
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
    });
    
    return {
      text: transcription.text,
      duration: (transcription as any).duration || 0,
    };
  } catch (error) {
    console.error('Audio transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
}
