"use client";

import { useState, useEffect } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  RotateCw,
  Check,
  Brain,
  Sparkles,
  HelpCircle,
  Eye,
  CheckCircle2,
  TrendingUp,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

interface Memory {
  _id: string;
  title: string;
  content: string;
  category: string;
  nextReview: string;
  difficulty?: "easy" | "medium" | "hard";
}

const demoMemories: Memory[] = [
  {
    _id: "demo-1",
    title: "How does the Attention Mechanism in Transformers calculate weights?",
    content:
      "Attention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V.\n\nIt computes the dot-product similarity between query and key vectors, scales by square root of key dimension to prevent small gradients, applies softmax to obtain probabilities, and takes a weighted sum of value vectors.",
    category: "Deep Learning",
    nextReview: new Date().toISOString(),
    difficulty: "medium",
  },
  {
    _id: "demo-2",
    title: "What is the core principle behind the SuperMemo-2 (SM-2) algorithm?",
    content:
      "SM-2 calculates the optimum inter-repetition interval using: I(1)=1 day, I(2)=6 days, and I(n)=I(n-1)*EF. The Ease Factor (EF) adapts based on the user's recall quality (0-5) to customize spaced review schedules per card.",
    category: "Cognitive Science",
    nextReview: new Date().toISOString(),
    difficulty: "easy",
  },
  {
    _id: "demo-3",
    title: "Explain the difference between dense vector retrieval and BM25 keyword search.",
    content:
      "BM25 relies on exact term frequencies and inverse document frequencies (lexical match).\n\nDense vector retrieval maps queries and documents into continuous multi-dimensional latent space (semantic match), enabling retrieval of conceptually relevant items even when exact vocabulary does not match.",
    category: "Information Retrieval",
    nextReview: new Date().toISOString(),
    difficulty: "hard",
  },
];

export default function ReviewPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewedCount, setReviewedCount] = useState(0);

  useEffect(() => {
    fetchMemoriesForReview();
  }, []);

  const fetchMemoriesForReview = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getMemories();
      const allMemories = response.memories || [];

      // Filter memories that are due for review
      const now = new Date();
      const dueMemories = allMemories.filter((mem: Memory) => {
        const nextReviewDate = new Date(mem.nextReview);
        return nextReviewDate <= now;
      });

      if (dueMemories.length > 0) {
        setMemories(dueMemories);
      } else {
        // Fallback to sample cards so the review engine is immediately usable
        setMemories(demoMemories);
      }
      setCurrentIndex(0);
    } catch {
      // Fallback gracefully to interactive demo cards
      setMemories(demoMemories);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (quality: number) => {
    if (currentIndex >= memories.length) return;

    const memory = memories[currentIndex];
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token && !memory._id.startsWith("demo-")) {
        await fetch(`/api/memories/${memory._id}/review`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quality }),
        });
      }
    } catch {
      // ignore
    }

    setReviewedCount((prev) => prev + 1);
    setIsFlipped(false);

    if (currentIndex < memories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(memories.length);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setReviewedCount(0);
    fetchMemoriesForReview();
  };

  return (
    <AuthGuard>
      <Layout>
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/memories">
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-softChrome/15 text-softChrome hover:text-glassBlue">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-softChrome flex items-center gap-2">
                  <Brain className="h-5 w-5 text-chromeViolet" />
                  Spaced Repetition Review
                </h1>
                <p className="text-xs text-softChrome/60">Active recall powered by the SM-2 algorithm</p>
              </div>
            </div>

            {memories.length > 0 && currentIndex < memories.length && (
              <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-mintFoam/15 border border-mintFoam/30 text-mintFoam shadow-glow-mint">
                Card {currentIndex + 1} of {memories.length}
              </span>
            )}
          </div>

          {/* Progress Bar */}
          {memories.length > 0 && currentIndex < memories.length && (
            <div className="h-2 w-full bg-carbonTeal-dark rounded-full overflow-hidden p-0.5 border border-softChrome/10">
              <div
                className="h-full bg-gradient-to-r from-chromeViolet via-hyperCobalt to-mintFoam rounded-full transition-all duration-300 shadow-glow-sm"
                style={{ width: `${((currentIndex + 1) / memories.length) * 100}%` }}
              />
            </div>
          )}

          {/* Review Completed State */}
          {currentIndex >= memories.length ? (
            <Card className="p-10 sm:p-14 text-center glass-panel border-chromeViolet/30 shadow-2xl relative overflow-hidden bg-carbonTeal/70">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-chromeViolet/15 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 space-y-5">
                <div className="h-16 w-16 rounded-3xl bg-mintFoam/15 border border-mintFoam/30 flex items-center justify-center mx-auto text-mintFoam shadow-glow-mint">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-softChrome">Daily Session Complete!</h2>
                <p className="text-sm text-softChrome/70 max-w-md mx-auto leading-relaxed">
                  You successfully reviewed <span className="font-semibold text-mintFoam font-mono">{reviewedCount}</span>{" "}
                  memories today. Neural retention has been calibrated for tomorrow.
                </p>
                <div className="pt-3 flex gap-3 justify-center">
                  <Button onClick={handleReset} variant="outline" className="gap-2 border-softChrome/15 text-softChrome hover:text-glassBlue">
                    <RotateCw className="h-4 w-4" /> Practice Again
                  </Button>
                  <Link href="/memories">
                    <Button className="shadow-glow-violet">Return to Vault</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ) : (
            /* Active Flashcard */
            <div className="space-y-6">
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="cursor-pointer group relative min-h-[380px] rounded-3xl p-8 sm:p-12 glass-panel border-softChrome/10 hover:border-chromeViolet/50 shadow-2xl transition-all duration-300 flex flex-col justify-between bg-carbonTeal/60"
              >
                {/* Top Card Bar */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-carbonTeal-surface/60 border border-softChrome/10 text-glassBlue">
                    {memories[currentIndex]?.category || "General Knowledge"}
                  </span>
                  <span className="text-xs text-softChrome/60 flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5 text-glassBlue" />
                    {isFlipped ? "Answer Side" : "Question Side"}
                  </span>
                </div>

                {/* Card Content Area */}
                <div className="py-8 text-center space-y-4">
                  {!isFlipped ? (
                    <div className="space-y-4">
                      <h2 className="text-xl sm:text-2xl font-bold text-softChrome leading-relaxed">
                        {memories[currentIndex]?.title}
                      </h2>
                      <p className="text-xs text-softChrome/50 font-mono">
                        (Click anywhere on card or press spacebar to flip)
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 text-left">
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-mintFoam">
                        <Sparkles className="h-3.5 w-3.5" /> Synthesized Recall:
                      </div>
                      <p className="text-base sm:text-lg text-softChrome/95 leading-relaxed whitespace-pre-wrap">
                        {memories[currentIndex]?.content}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom hint */}
                <div className="text-center text-[11px] text-softChrome/50 border-t border-softChrome/10 pt-4">
                  {isFlipped ? "Rate your recall quality below to set next review date" : "Tap card to flip"}
                </div>
              </div>

              {/* Recall Quality Rating Buttons (visible when flipped) */}
              {isFlipped && (
                <div className="p-6 rounded-2xl glass-panel border-softChrome/10 space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300 bg-carbonTeal/60">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-softChrome">How smoothly did you recall this?</span>
                    <span className="text-softChrome/50 font-mono">SM-2 Algorithm Calibration</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                      onClick={() => handleReview(1)}
                      className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-white transition-all text-left space-y-1 cursor-pointer"
                    >
                      <span className="block text-xs font-bold uppercase tracking-wider">Again</span>
                      <span className="block text-[11px] text-rose-300/70">Forgot / &lt;10m</span>
                    </button>

                    <button
                      onClick={() => handleReview(3)}
                      className="p-3 rounded-xl border border-skinSand/30 bg-skinSand/15 hover:bg-skinSand/25 text-skinSand transition-all text-left space-y-1 cursor-pointer"
                    >
                      <span className="block text-xs font-bold uppercase tracking-wider">Hard</span>
                      <span className="block text-[11px] text-skinSand/70">Hesitation / 1 day</span>
                    </button>

                    <button
                      onClick={() => handleReview(4)}
                      className="p-3 rounded-xl border border-chromeViolet/30 bg-chromeViolet/15 hover:bg-chromeViolet/25 text-glassBlue transition-all text-left space-y-1 cursor-pointer"
                    >
                      <span className="block text-xs font-bold uppercase tracking-wider">Good</span>
                      <span className="block text-[11px] text-glassBlue/70">Normal recall / 3 days</span>
                    </button>

                    <button
                      onClick={() => handleReview(5)}
                      className="p-3 rounded-xl border border-mintFoam/30 bg-mintFoam/15 hover:bg-mintFoam/25 text-mintFoam transition-all text-left space-y-1 cursor-pointer"
                    >
                      <span className="block text-xs font-bold uppercase tracking-wider">Easy</span>
                      <span className="block text-[11px] text-mintFoam/70">Instant / 7 days</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Layout>
    </AuthGuard>
  );
}
