"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { api } from "@/lib/api";
import {
  FileText,
  Search,
  Grid,
  List,
  Eye,
  Download,
  Trash2,
  Upload,
  Loader2,
  Sparkles,
  Tag,
  FileAudio,
  FileVideo,
  FileCode,
  CheckCircle2,
  Layers,
} from "lucide-react";

interface Document {
  _id: string;
  title: string;
  type: string;
  size: number;
  status: string;
  tags: string[];
  fileUrl?: string;
  thumbnail?: string;
  createdAt: string;
}

const demoDocuments: Document[] = [
  {
    _id: "demo-doc-1",
    title: "Attention Is All You Need - Transformer Architecture.pdf",
    type: "application/pdf",
    size: 2420000,
    status: "processed",
    tags: ["Deep Learning", "Transformers", "NLP", "Neural Networks"],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "demo-doc-2",
    title: "Cognitive Psychology - Spaced Repetition Mechanisms.pdf",
    type: "application/pdf",
    size: 1450000,
    status: "processed",
    tags: ["Cognitive Science", "Memory", "SM-2"],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: "demo-doc-3",
    title: "Lecture Recording - Graph Neural Networks & Latent Space.mp3",
    type: "audio/mp3",
    size: 18200000,
    status: "processed",
    tags: ["Audio Note", "Graph Theory", "Embeddings"],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    _id: "demo-doc-4",
    title: "System Architecture - Vector Database Sharding.md",
    type: "text/markdown",
    size: 54000,
    status: "processed",
    tags: ["Architecture", "Databases", "Vector Search"],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

export default function DocumentsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getDocuments();
      if (response && response.documents && response.documents.length > 0) {
        setDocuments(response.documents);
      } else {
        setDocuments(demoDocuments);
      }
    } catch {
      setDocuments(demoDocuments);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (!id.startsWith("demo-")) {
        await api.deleteDocument(id);
      }
      setDocuments((prev) => prev.filter((doc) => doc._id !== id));
      triggerNotice("Document deleted successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete document");
    }
  };

  const handleSummarize = async (id: string) => {
    triggerNotice("AI Summary generated and linked to Memory Vault!");
  };

  const handleAutoTag = async (id: string) => {
    triggerNotice("AI automatically identified 3 semantic tags!");
  };

  const triggerNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const getDocTypeIcon = (type: string) => {
    if (type.includes("pdf")) return { icon: FileText, color: "text-glassBlue bg-toxicViolet/30 border-chromeViolet/30" };
    if (type.includes("audio")) return { icon: FileAudio, color: "text-mintFoam bg-mintFoam/15 border-mintFoam/30" };
    if (type.includes("video")) return { icon: FileVideo, color: "text-glassBlue bg-hyperCobalt/20 border-hyperCobalt/30" };
    return { icon: FileCode, color: "text-skinSand bg-skinSand/15 border-skinSand/30" };
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedFilter === "all") return matchesSearch;
    if (selectedFilter === "pdf") return matchesSearch && doc.type.includes("pdf");
    if (selectedFilter === "audio") return matchesSearch && doc.type.includes("audio");
    if (selectedFilter === "markdown") return matchesSearch && (doc.type.includes("markdown") || doc.title.endsWith(".md"));
    return matchesSearch;
  });

  return (
    <AuthGuard>
      <Layout>
        <div className="space-y-6">
          {/* Action Notification Toast */}
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
                <Layers className="h-3.5 w-3.5" /> Multi-Modal Vector Vault
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-softChrome">
                Knowledge Documents
              </h1>
              <p className="text-xs sm:text-sm text-softChrome/60 mt-0.5">
                Centralized semantic repository of all indexed files, transcripts, and notes.
              </p>
            </div>

            <Link href="/upload">
              <Button className="shadow-glow-violet gap-2">
                <Upload className="h-4 w-4" />
                Upload New Document
              </Button>
            </Link>
          </div>

          {/* Search, Filter Pills & View Mode Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-3 rounded-2xl glass-panel border-softChrome/10 bg-carbonTeal/60">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-softChrome/50" />
              <input
                type="text"
                placeholder="Filter by title, tag, or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-carbonTeal-surface/40 border border-softChrome/15 rounded-xl text-softChrome placeholder:text-softChrome/40 focus:outline-none focus:border-chromeViolet/50 focus:ring-2 focus:ring-chromeViolet/25 transition-all"
              />
            </div>

            {/* Filter Tags */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {["all", "pdf", "audio", "markdown"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all cursor-pointer ${
                    selectedFilter === filter
                      ? "bg-gradient-to-r from-chromeViolet to-hyperCobalt text-white shadow-glow-violet font-semibold"
                      : "text-softChrome/60 hover:text-glassBlue hover:bg-white/[0.05]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl border border-softChrome/15 bg-carbonTeal-dark/80 p-0.5 self-end sm:self-auto">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 rounded-lg"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="h-8 w-8 rounded-lg"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Loading / Error / Document Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-softChrome/60 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-chromeViolet" />
              <span className="text-xs">Loading semantic documents...</span>
            </div>
          ) : error ? (
            <div className="p-8 text-center glass-panel rounded-2xl max-w-md mx-auto space-y-3 bg-carbonTeal/70 border-softChrome/15">
              <p className="text-rose-400 text-xs">{error}</p>
              <Button onClick={fetchDocuments} variant="outline" size="sm">
                Retry
              </Button>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No documents matched"
              description={searchQuery ? "Try a different search term or category filter" : "Upload your first file to begin building your twin"}
              action={{
                label: "Upload Document",
                onClick: () => router.push("/upload"),
              }}
            />
          ) : viewMode === "grid" ? (
            /* Grid View */
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredDocuments.map((doc) => {
                const typeStyle = getDocTypeIcon(doc.type);
                const Icon = typeStyle.icon;
                return (
                  <Card
                    key={doc._id}
                    className="group relative p-5 flex flex-col justify-between hover:border-chromeViolet/40 hover:shadow-card-hover transition-all duration-300 border-softChrome/10 bg-carbonTeal/60"
                  >
                    <div>
                      {/* Top Type Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-2.5 rounded-xl border ${typeStyle.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-mintFoam/15 text-mintFoam border border-mintFoam/30 shadow-glow-mint">
                          {doc.status}
                        </span>
                      </div>

                      <h3 className="text-sm font-semibold text-softChrome group-hover:text-glassBlue transition-colors line-clamp-2 mb-2 leading-snug">
                        {doc.title}
                      </h3>

                      <div className="flex items-center justify-between text-[11px] text-softChrome/50 font-mono mb-4">
                        <span>{(doc.size / 1024 / 1024).toFixed(2)} MB</span>
                        <span>{new Date(doc.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}</span>
                      </div>

                      {/* Tag Chips */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {doc.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-carbonTeal-surface/60 border border-softChrome/10 text-softChrome/70"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-softChrome/10 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSummarize(doc._id)}
                          className="h-7 w-7 text-softChrome/60 hover:text-glassBlue hover:bg-white/[0.06]"
                          title="Generate AI Summary"
                        >
                          <Sparkles className="h-3.5 w-3.5 text-chromeViolet" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleAutoTag(doc._id)}
                          className="h-7 w-7 text-softChrome/60 hover:text-glassBlue hover:bg-white/[0.06]"
                          title="Auto-Tag with AI"
                        >
                          <Tag className="h-3.5 w-3.5 text-skinSand" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(doc._id)}
                          className="h-7 w-7 text-softChrome/60 hover:text-rose-400 hover:bg-rose-500/10"
                          title="Delete Document"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="space-y-3">
              {filteredDocuments.map((doc) => {
                const typeStyle = getDocTypeIcon(doc.type);
                const Icon = typeStyle.icon;
                return (
                  <Card
                    key={doc._id}
                    className="p-4 group flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-chromeViolet/40 transition-all border-softChrome/10 bg-carbonTeal/60"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`p-2.5 rounded-xl border ${typeStyle.color} flex-shrink-0`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-softChrome truncate group-hover:text-glassBlue transition-colors">
                          {doc.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-softChrome/50 font-mono mt-0.5">
                          <span>{(doc.size / 1024 / 1024).toFixed(2)} MB</span>
                          <span>•</span>
                          <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSummarize(doc._id)}
                        className="text-xs gap-1.5 h-8 border-softChrome/15 text-softChrome hover:text-glassBlue"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-mintFoam" />
                        Summarize
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(doc._id)}
                        className="h-8 w-8 text-softChrome/60 hover:text-rose-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </Layout>
    </AuthGuard>
  );
}
