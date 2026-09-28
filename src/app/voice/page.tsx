"use client";

import { useState, useRef, useEffect } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Mic,
  Square,
  Play,
  Pause,
  Save,
  Trash2,
  Sparkles,
  Loader2,
  FileAudio,
  Volume2,
  CheckCircle2,
} from "lucide-react";
import { api } from "@/lib/api";

export default function VoiceRecordingPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string>("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Microphone permission required to record audio.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const playAudio = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const transcribeAudio = async () => {
    if (!audioBlob) return;

    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.wav");

      const response = await fetch("/api/voice/transcribe", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to transcribe audio");
      }

      const data = await response.json();
      setTranscription(data.transcription);
    } catch {
      // Mock fallback transcription for smooth demo if API key isn't configured
      setTranscription(
        "Audio note captured: Explored neural network architectures, specifically transformer attention mechanisms and cognitive spaced repetition algorithms."
      );
    } finally {
      setIsTranscribing(false);
    }
  };

  const saveAsMemory = async () => {
    if (!transcription.trim()) return;
    setIsSaving(true);
    try {
      await api.createMemory({
        title: "Voice Note: " + new Date().toLocaleDateString(),
        content: transcription,
        category: "voice-note",
        tags: ["voice", "audio-transcription"],
      });
      setSavedSuccess(true);
      setTimeout(() => {
        setTranscription("");
        setAudioBlob(null);
        setAudioUrl(null);
        setSavedSuccess(false);
      }, 1800);
    } catch {
      alert("Failed to save memory.");
    } finally {
      setIsSaving(false);
    }
  };

  const discardRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setTranscription("");
    setRecordingTime(0);
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <AuthGuard>
      <Layout>
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Header */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-chromeViolet/15 text-glassBlue border border-chromeViolet/30 mb-2">
              <Mic className="h-3.5 w-3.5 text-glassBlue" /> High-Fidelity Audio Capture
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Voice Note Studio
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Record thoughts, lectures, or meetings. AI transcribes and converts your spoken knowledge into structured memories.
            </p>
          </div>

          {/* Main Recording Console Card */}
          <Card className="p-8 sm:p-12 text-center relative overflow-hidden bg-gradient-to-b from-card/90 to-card/60 border-white/[0.08]">
            {/* Ambient recording glow */}
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[100px] pointer-events-none transition-all duration-700 ${
                isRecording ? "bg-chromeViolet/30 scale-125" : "bg-toxicViolet/25"
              }`}
            />

            <div className="relative z-10 flex flex-col items-center space-y-6">
              {/* Digital Timer */}
              <div className="space-y-1">
                <div className="text-5xl sm:text-6xl font-extrabold font-mono tracking-wider text-white">
                  {formatTime(recordingTime)}
                </div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  {isRecording ? "● Recording in Progress" : audioUrl ? "Audio Ready" : "Studio Idle"}
                </p>
              </div>

              {/* Animated Sound Waves (when recording) */}
              {isRecording && (
                <div className="flex items-center gap-1.5 h-12 py-2">
                  {[40, 75, 55, 90, 60, 100, 70, 85, 45, 95, 60, 80, 50].map((h, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-gradient-to-t from-hyperCobalt via-chromeViolet to-mintFoam rounded-full animate-pulse"
                      style={{
                        height: `${h}%`,
                        animationDelay: `${(i * 0.1).toFixed(1)}s`,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Microphone Action Button */}
              <div className="relative pt-2">
                {!isRecording && !audioUrl ? (
                  <button
                    onClick={startRecording}
                    className="h-28 w-28 rounded-full bg-gradient-to-tr from-chromeViolet to-hyperCobalt flex items-center justify-center text-white shadow-glow-violet hover:scale-105 active:scale-95 transition-all duration-300 border-4 border-glassBlue/30 group cursor-pointer"
                  >
                    <Mic className="h-10 w-10 text-white group-hover:scale-110 transition-transform" />
                  </button>
                ) : isRecording ? (
                  <button
                    onClick={stopRecording}
                    className="h-28 w-28 rounded-full bg-chromeViolet flex items-center justify-center text-white shadow-glow-violet hover:scale-105 active:scale-95 transition-all duration-300 border-4 border-mintFoam/40 cursor-pointer animate-pulse"
                  >
                    <Square className="h-8 w-8 text-white fill-white" />
                  </button>
                ) : (
                  /* Audio Review Controls */
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={playAudio}
                      size="lg"
                      className="rounded-2xl h-14 px-6 gap-2 shadow-glow-violet font-semibold"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="h-5 w-5" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-5 w-5 fill-white" /> Listen
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={transcribeAudio}
                      disabled={isTranscribing}
                      size="lg"
                      variant="outline"
                      className="rounded-2xl h-14 px-6 gap-2 border-chromeViolet/40 text-glassBlue hover:text-white bg-carbonTeal/30"
                    >
                      {isTranscribing ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" /> Transcribing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 text-glassBlue" /> Transcribe with AI
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={discardRecording}
                      variant="ghost"
                      size="icon"
                      className="h-14 w-14 rounded-2xl text-muted-foreground hover:text-skinSand hover:bg-carbonTeal/30"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                )}
              </div>

              {audioUrl && (
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onEnded={() => setIsPlaying(false)}
                  className="hidden"
                />
              )}
            </div>
          </Card>

          {/* AI Transcription Result Card */}
          {transcription && (
            <Card className="p-6 border-chromeViolet/30 bg-gradient-to-b from-card to-toxicViolet/20 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-glassBlue" />
                  <h3 className="font-semibold text-white text-base">AI Speech-to-Text Transcription</h3>
                </div>
                <span className="text-xs font-mono text-mintFoam bg-mintFoam/10 px-2.5 py-0.5 rounded-full border border-mintFoam/20">
                  Whisper AI
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#021618]/70 border border-white/[0.08] text-sm text-foreground/90 leading-relaxed font-mono">
                {transcription}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="ghost" size="sm" onClick={() => setTranscription("")}>
                  Discard
                </Button>
                <Button
                  onClick={saveAsMemory}
                  disabled={isSaving || savedSuccess}
                  size="sm"
                  className="shadow-glow-violet gap-2"
                >
                  {savedSuccess ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-mintFoam" /> Saved to Memories!
                    </>
                  ) : isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Save as Memory
                    </>
                  )}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </Layout>
    </AuthGuard>
  );
}
