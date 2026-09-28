"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/stats-card";
import { EmptyState } from "@/components/ui/empty-state";
import { api } from "@/lib/api";
import {
  Clock,
  Search,
  Brain,
  TrendingUp,
  Target,
  RefreshCw,
  Plus,
  Eye,
  Trash2,
  Star,
  BookOpen,
  Download,
  Upload as UploadIcon,
  Loader2,
  CheckCircle2,
  Sparkles,
  Layers,
} from "lucide-react";

interface Memory {
  _id: string;
  title: string;
  content: string;
  category: string;
  retentionScore: number;
  lastReviewed: string;
  nextReview: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  starred: boolean;
}

const sampleMemories: Memory[] = [
  {
    _id: "sample-mem-1",
    title: "Multi-Head Attention Computation Formula",
    content:
      "Attention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V. Linearly projects Queries, Keys, and Values h times with distinct learned parameter matrices.",
    category: "Deep Learning",
    retentionScore: 92,
    lastReviewed: new Date().toISOString(),
    nextReview: new Date(Date.now() + 86400000 * 3).toISOString(),
    difficulty: "medium",
    tags: ["Transformer", "Attention", "NLP"],
    starred: true,
  },
  {
    _id: "sample-mem-2",
    title: "SuperMemo-2 (SM-2) Spaced Recall Scheduling",
    content:
      "Calculates interval I(n) based on quality ratings (0-5) and adjusts Ease Factor (EF). Minimum EF floor is 1.3 to avoid interval stagnation.",
    category: "Cognitive Science",
    retentionScore: 85,
    lastReviewed: new Date().toISOString(),
    nextReview: new Date().toISOString(),
    difficulty: "easy",
    tags: ["Spaced Repetition", "Recall", "SM-2"],
    starred: false,
  },
  {
    _id: "sample-mem-3",
    title: "Dense Vector Embeddings vs Sparse Inverted Indices",
    content:
      "Sparse indices (BM25) match exact vocabulary tokens. Dense vectors (BERT, OpenAI text-embedding-3) capture continuous conceptual semantics in latent space.",
    category: "Information Retrieval",
    retentionScore: 78,
    lastReviewed: new Date(Date.now() - 86400000 * 2).toISOString(),
    nextReview: new Date().toISOString(),
    difficulty: "hard",
    tags: ["Vector Search", "Embeddings", "RAG"],
    starred: true,
  },
  {
    _id: "sample-mem-4",
    title: "CAP Theorem in Distributed Systems",
    content:
      "Any distributed data store can only simultaneously guarantee at most two of the three properties: Consistency, Availability, and Partition Tolerance.",
    category: "System Design",
    retentionScore: 95,
    lastReviewed: new Date(Date.now() - 86400000 * 5).toISOString(),
    nextReview: new Date(Date.now() + 86400000 * 7).toISOString(),
    difficulty: "easy",
    tags: ["Distributed Systems", "Architecture"],
    starred: false,
  },
];

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("Machine Learning");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getMemories();
      if (response && response.memories && response.memories.length > 0) {
        setMemories(response.memories);
      } else {
        setMemories(sampleMemories);
      }
    } catch {
      setMemories(sampleMemories);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (!id.startsWith("sample-")) {
        await api.deleteMemory(id);
      }
      setMemories((prev) => prev.filter((m) => m._id !== id));
      triggerNotice("Memory removed from vault");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete memory");
    }
  };

  const handleToggleStar = async (id: string, starred: boolean) => {
    try {
      if (!id.startsWith("sample-")) {
        await api.updateMemory(id, { starred: !starred });
      }
      setMemories((prev) =>
        prev.map((m) => (m._id === id ? { ...m, starred: !starred } : m))
      );
    } catch {
      // ignore
    }
  };

  const handleReview = async (id: string, quality: number) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token && !id.startsWith("sample-")) {
        await fetch(`/api/memories/${id}/review`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quality }),
        });
      }
      triggerNotice(`Recalibrated interval (Quality ${quality}/5)`);
    } catch {
      // ignore
    }
  };

  const handleCreateMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      const created: Memory = {
        _id: Date.now().toString(),
        title: newTitle,
        content: newContent,
        category: newCategory,
        retentionScore: 80,
        lastReviewed: new Date().toISOString(),
        nextReview: new Date(Date.now() + 86400000).toISOString(),
        difficulty: "medium",
        tags: [newCategory],
        starred: false,
      };

      setMemories((prev) => [created, ...prev]);
      setIsAddOpen(false);
      setNewTitle("");
      setNewContent("");
      triggerNotice("New knowledge memory created!");
    } catch {
      alert("Failed to create memory");
    }
  };

  const triggerNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const getDifficultyColor = (diff?: string) => {
    switch (diff) {
      case "easy":
        return "bg-mintFoam/15 text-mintFoam border-mintFoam/30";
      case "medium":
        return "bg-chromeViolet/20 text-glassBlue border-chromeViolet/35";
      case "hard":
        return "bg-skinSand/15 text-skinSand border-skinSand/30";
      default:
        return "bg-carbonTeal-surface text-softChrome/70 border-softChrome/15";
    }
  };

  const now = new Date();
  const dueForReview = memories.filter((m) => new Date(m.nextReview) <= now).length;

  const filteredMemories = memories.filter((mem) => {
    const matchesSearch =
      mem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (filterCategory === "all") return matchesSearch;
    return matchesSearch && mem.category.toLowerCase() === filterCategory.toLowerCase();
  });

  return (
    <AuthGuard>
      <Layout>
        <div className="space-y-6">
          {/* Notification Toast */}
          {actionNotice && (
            <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl glass-panel border-mintFoam/30 text-mintFoam text-xs flex items-center gap-2.5 shadow-2xl animate-in slide-in-from-bottom-4 duration-300 bg-carbonTeal/90">
              <CheckCircle2 className="h-4 w-4 text-mintFoam" />
              <span>{actionNotice}</span>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-mintFoam/15 text-mintFoam border border-mintFoam/30 mb-2 shadow-glow-mint">
                <Brain className="h-3.5 w-3.5" /> Long-Term Synaptic Memory
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-softChrome">
                Memory Vault
              </h1>
              <p className="text-xs sm:text-sm text-softChrome/60 mt-0.5">
                Atomic conceptual cards algorithmically maintained with SuperMemo-2 spaced repetition.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/review">
                <Button variant="outline" className="gap-2 border-chromeViolet/30 text-glassBlue hover:text-mintFoam hover:border-chromeViolet/50">
                  <RefreshCw className="h-4 w-4 text-glassBlue" />
                  Review Due ({dueForReview})
                </Button>
              </Link>
              <Button onClick={() => setIsAddOpen(true)} className="shadow-glow-violet gap-2">
                <Plus className="h-4 w-4" />
                Add Memory
              </Button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Vault Memories"
              value={memories.length}
              icon={Brain}
              description="atomic concepts"
            />
            <StatsCard
              title="Due For Recall"
              value={dueForReview}
              change={{ value: `${dueForReview} ready`, trend: dueForReview > 0 ? "up" : "neutral" }}
              icon={Clock}
              description="optimal SM-2 timing"
            />
            <StatsCard
              title="Average Retention"
              value="88%"
              change={{ value: "+4.1%", trend: "up" }}
              icon={TrendingUp}
              description="stability rating"
            />
            <StatsCard
              title="Mastered Concepts"
              value="18"
              icon={Target}
              description="interval > 30 days"
            />
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-3 rounded-2xl glass-panel border-softChrome/10 bg-carbonTeal/60">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-softChrome/50" />
              <input
                type="text"
                placeholder="Search memories, formulas, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-carbonTeal-surface/40 border border-softChrome/15 rounded-xl text-softChrome placeholder:text-softChrome/40 focus:outline-none focus:border-chromeViolet/50 focus:ring-2 focus:ring-chromeViolet/25 transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl bg-carbonTeal-surface border border-softChrome/15 text-softChrome focus:outline-none focus:ring-2 focus:ring-chromeViolet/30"
              >
                <option value="all">All Disciplines</option>
                <option value="Deep Learning">Deep Learning</option>
                <option value="Cognitive Science">Cognitive Science</option>
                <option value="Information Retrieval">Information Retrieval</option>
                <option value="System Design">System Design</option>
              </select>

              <div className="flex items-center rounded-xl border border-softChrome/15 bg-carbonTeal-dark/80 p-0.5">
                <Button
                  variant={viewMode === "cards" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("cards")}
                  className="h-8 w-8 rounded-lg text-softChrome hover:text-glassBlue"
                >
                  <BookOpen className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 rounded-lg text-softChrome hover:text-glassBlue"
                >
                  <Layers className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Memory Cards Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-softChrome/60 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-chromeViolet" />
              <span className="text-xs">Synchronizing synaptic memories...</span>
            </div>
          ) : filteredMemories.length === 0 ? (
            <EmptyState
              icon={Brain}
              title="No memories found"
              description="Add a new concept card to start exercising spaced repetition"
              action={{
                label: "Add Memory",
                onClick: () => setIsAddOpen(true),
              }}
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMemories.map((mem) => (
                <Card
                  key={mem._id}
                  className="group relative p-5 flex flex-col justify-between hover:border-chromeViolet/40 hover:shadow-card-hover transition-all duration-300 border-softChrome/10 bg-carbonTeal/60"
                >
                  <div className="space-y-3">
                    {/* Top Row: category & star */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-carbonTeal-surface/60 border border-softChrome/10 text-glassBlue">
                          {mem.category}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getDifficultyColor(
                            mem.difficulty
                          )}`}
                        >
                          {mem.difficulty}
                        </span>
                      </div>

                      <button
                        onClick={() => handleToggleStar(mem._id, mem.starred)}
                        className="p-1 text-softChrome/50 hover:text-skinSand transition-colors"
                      >
                        <Star
                          className={`h-4 w-4 ${
                            mem.starred ? "text-skinSand fill-skinSand" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* Title & Content */}
                    <div>
                      <h3 className="text-sm font-semibold text-softChrome group-hover:text-glassBlue transition-colors line-clamp-2 leading-snug">
                        {mem.title}
                      </h3>
                      <p className="text-xs text-softChrome/60 mt-1.5 line-clamp-3 leading-relaxed">
                        {mem.content}
                      </p>
                    </div>

                    {/* Retention Progress */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-[11px] text-softChrome/50 font-mono mb-1">
                        <span>Retention Stability</span>
                        <span className="text-mintFoam font-semibold">{mem.retentionScore}%</span>
                      </div>
                      <div className="h-1.5 bg-carbonTeal-dark rounded-full overflow-hidden border border-softChrome/10">
                        <div
                          className="h-full bg-gradient-to-r from-chromeViolet via-hyperCobalt to-mintFoam rounded-full shadow-glow-sm"
                          style={{ width: `${mem.retentionScore}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions / Inline Review */}
                  <div className="pt-4 mt-4 border-t border-softChrome/10 flex items-center justify-between">
                    {reviewingId === mem._id ? (
                      <div className="flex items-center gap-1.5 w-full">
                        <span className="text-[10px] text-softChrome/50 mr-1">Rate:</span>
                        {[1, 3, 4, 5].map((q) => (
                          <button
                            key={q}
                            onClick={() => {
                              handleReview(mem._id, q);
                              setReviewingId(null);
                            }}
                            className="flex-1 py-1 rounded-lg text-xs font-mono font-semibold bg-white/[0.08] hover:bg-chromeViolet hover:text-white transition-colors cursor-pointer"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setReviewingId(mem._id)}
                          className="text-xs h-8 gap-1.5 border-softChrome/15 text-softChrome hover:text-glassBlue"
                        >
                          <Eye className="h-3.5 w-3.5 text-glassBlue" />
                          Rate Recall
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(mem._id)}
                          className="h-8 w-8 text-softChrome/50 hover:text-rose-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Add Memory Modal Overlay */}
          {isAddOpen && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
              <Card className="w-full max-w-lg p-6 glass-panel border-softChrome/15 shadow-2xl space-y-4 bg-carbonTeal/95">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-softChrome flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-chromeViolet" />
                    Create New Knowledge Memory
                  </h3>
                  <button
                    onClick={() => setIsAddOpen(false)}
                    className="text-xs text-softChrome/50 hover:text-softChrome"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateMemory} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-softChrome">Concept Title / Question</label>
                    <input
                      type="text"
                      placeholder="e.g. Backpropagation in CNNs"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-carbonTeal-surface/40 border border-softChrome/15 rounded-xl text-softChrome placeholder:text-softChrome/40 focus:outline-none focus:border-chromeViolet/50"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-softChrome">Explanation / Answer</label>
                    <textarea
                      placeholder="e.g. Backpropagation computes gradients of loss function with respect to weights using chain rule..."
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-carbonTeal-surface/40 border border-softChrome/15 rounded-xl text-softChrome placeholder:text-softChrome/40 focus:outline-none focus:border-chromeViolet/50 resize-none h-28"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-softChrome">Category</label>
                    <input
                      type="text"
                      placeholder="e.g. Deep Learning"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-carbonTeal-surface/40 border border-softChrome/15 rounded-xl text-softChrome placeholder:text-softChrome/40 focus:outline-none focus:border-chromeViolet/50"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)} className="text-softChrome/60 hover:text-glassBlue">
                      Cancel
                    </Button>
                    <Button type="submit" className="shadow-glow-violet">
                      Save to Vault
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          )}
        </div>
      </Layout>
    </AuthGuard>
  );
}
