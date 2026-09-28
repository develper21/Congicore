import { transcribeAudio } from './audio-transcriber';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

export interface VideoTranscriptionResult {
  text: string;
  duration: number;
}

/**
 * Extract audio from video file using ffmpeg
 */
async function extractAudioFromVideo(videoPath: string): Promise<string> {
  const audioPath = path.join(
    path.dirname(videoPath),
    `${path.basename(videoPath, path.extname(videoPath))}.mp3`
  );
  
  await execAsync(`ffmpeg -i "${videoPath}" -vn -acodec libmp3lame -q:a 2 "${audioPath}"`);
  
  return audioPath;
}

/**
 * Transcribe video file by extracting audio and transcribing it
 */
export async function transcribeVideo(filePath: string): Promise<VideoTranscriptionResult> {
  try {
    const audioPath = await extractAudioFromVideo(filePath);
    const result = await transcribeAudio(audioPath);
    
    // Clean up temporary audio file
    fs.unlinkSync(audioPath);
    
    return result;
  } catch (error) {
    console.error('Video transcription error:', error);
    throw new Error('Failed to transcribe video');
  }
}
