"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Layout } from "@/components/layout/layout";
import { AuthGuard } from "@/components/auth/auth-guard";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import {
  FileText,
  MessageSquare,
  Network,
  Brain,
  TrendingUp,
  Clock,
  Loader2,
  Sparkles,
  Zap,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

interface DashboardStats {
  totalDocuments: number;
  aiConversations: number;
  knowledgeGraphNodes: number;
  memoryRetention: number;
  documentsThisWeek: number;
  documentsThisMonth: number;
}

interface LearningAnalytics {
  totalMemories: number;
  reviewedToday: number;
  retentionRate: number;
  averageEaseFactor: number;
  streakDays: number;
  categories: Array<{ category: string; count: number; averageRetention: number }>;
  weeklyProgress: Array<{ date: string; reviews: number; retention: number }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalDocuments: 14,
    aiConversations: 8,
    knowledgeGraphNodes: 64,
    memoryRetention: 88,
    documentsThisWeek: 4,
    documentsThisMonth: 12,
  });
  const [learningAnalytics, setLearningAnalytics] = useState<LearningAnalytics | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
    fetchLearningAnalytics();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getStats();
      if (response && response.stats) {
        setStats(response.stats);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  const fetchLearningAnalytics = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) return;
      const response = await fetch("/api/analytics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) return;

      const data = await response.json();
      setLearningAnalytics(data.analytics);
      setInsights(data.insights || []);
    } catch {
      // Analytics optional
    }
  };

  return (
    <AuthGuard>
      <Layout>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Synchronizing Neural Workspace...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 glass-panel rounded-2xl p-8 max-w-lg mx-auto">
            <p className="text-rose-400 mb-4 text-sm">{error}</p>
            <Button onClick={fetchStats} variant="outline" size="sm">
              Retry Sync
            </Button>
          </div>
        ) : (
          <div className="space-y-8 pb-12">
            {/* Top Welcome & System Status Banner */}
            <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-carbonTeal via-carbonTeal-dark to-toxicViolet/50 border border-chromeViolet/25 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-chromeViolet/20 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-mintFoam/15 text-mintFoam border border-mintFoam/30 shadow-glow-mint">
                    <span className="h-2 w-2 rounded-full bg-mintFoam animate-pulse" />
                    Neural Intelligence Engine 2.0 • Active
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-softChrome">
                    Welcome to your <span className="gradient-text">Second Brain</span>
                  </h1>
                  <p className="text-sm sm:text-base text-softChrome/70 max-w-2xl leading-relaxed">
                    All document embeddings, memory connections, and spaced repetitions are up to date.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link href="/chat">
                    <Button size="lg" className="shadow-glow-violet gap-2">
                      <Sparkles className="h-4 w-4 text-mintFoam" />
                      Start AI Chat
                    </Button>
                  </Link>
                  <Link href="/upload">
                    <Button variant="outline" size="lg" className="gap-2 border-softChrome/15 text-softChrome hover:text-glassBlue">
                      <Zap className="h-4 w-4 text-glassBlue" />
                      Upload Docs
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total Documents"
                value={stats.totalDocuments.toString()}
                change={{ value: `+${stats.documentsThisMonth} this mo`, trend: "up" }}
                icon={FileText}
                description="vector indexed"
              />
              <StatsCard
                title="AI Conversations"
                value={stats.aiConversations.toString()}
                change={{ value: "+24% active", trend: "up" }}
                icon={MessageSquare}
                description="semantic queries"
              />
              <StatsCard
                title="Graph Nodes"
                value={stats.knowledgeGraphNodes.toString()}
                change={{ value: "+18 linked", trend: "up" }}
                icon={Network}
                description="connected concepts"
              />
              <StatsCard
                title="Memory Retention"
                value={`${stats.memoryRetention}%`}
                change={{ value: "+5.2% recall", trend: "up" }}
                icon={Brain}
                description="spaced repetition score"
              />
            </div>

            {/* Learning Analytics if available */}
            {learningAnalytics && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                  title="Total Memories"
                  value={learningAnalytics.totalMemories.toString()}
                  icon={Brain}
                  description="in knowledge vault"
                />
                <StatsCard
                  title="Reviewed Today"
                  value={learningAnalytics.reviewedToday.toString()}
                  icon={Clock}
                  description="memories recalled"
                />
                <StatsCard
                  title="Retention Rate"
                  value={`${learningAnalytics.retentionRate}%`}
                  icon={TrendingUp}
                  description="accuracy average"
                />
                <StatsCard
                  title="Study Streak"
                  value={`${learningAnalytics.streakDays} Days`}
                  icon={ShieldCheck}
                  description="daily consistency"
                />
              </div>
            )}

            {/* AI Insights Card */}
            {insights && insights.length > 0 && (
              <Card className="border-chromeViolet/30 bg-gradient-to-r from-toxicViolet/30 to-carbonTeal-surface/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-chromeViolet" />
                    <CardTitle className="text-lg text-softChrome">Proactive AI Insights</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                    {insights.map((insight, index) => (
                      <div
                        key={index}
                        className="p-3.5 rounded-xl border border-softChrome/10 bg-carbonTeal/40 text-xs text-softChrome/70 leading-relaxed flex items-start gap-2.5"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-chromeViolet mt-1.5 flex-shrink-0" />
                        <span>{insight}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Main Interactive Grid: Recent Activity + Quick Actions */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <RecentActivity />
              </div>
              <div>
                <QuickActions />
              </div>
            </div>

            {/* Knowledge Growth & Insights Footer Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Knowledge Growth Meter */}
              <Card className="p-6 border-softChrome/10 bg-carbonTeal/60">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-softChrome">Knowledge Ingestion Growth</h3>
                    <p className="text-xs text-softChrome/60">Document intake trajectory</p>
                  </div>
                  <Link href="/documents" className="text-xs text-glassBlue hover:text-mintFoam transition-colors flex items-center gap-1">
                    Manage Docs <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-softChrome/60">This Week</span>
                    <span className="font-semibold text-softChrome font-mono">+{stats.documentsThisWeek} items</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-softChrome/60">This Month</span>
                    <span className="font-semibold text-softChrome font-mono">+{stats.documentsThisMonth} items</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-softChrome/60">Total Ingested</span>
                    <span className="font-semibold text-softChrome font-mono">{stats.totalDocuments} items</span>
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between text-[11px] text-softChrome/60 mb-1.5">
                      <span>Monthly Storage Cap</span>
                      <span className="text-mintFoam font-mono font-semibold">68% Available</span>
                    </div>
                    <div className="h-2.5 bg-carbonTeal-dark rounded-full overflow-hidden border border-softChrome/10">
                      <div className="h-full w-2/5 bg-gradient-to-r from-chromeViolet via-hyperCobalt to-mintFoam rounded-full shadow-glow-sm" />
                    </div>
                  </div>
                </div>
              </Card>

              {/* AI Cognitive Highlights */}
              <Card className="p-6 border-softChrome/10 bg-carbonTeal/60">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-softChrome">Cognitive Neural Highlights</h3>
                    <p className="text-xs text-softChrome/60">Behavioral learning patterns</p>
                  </div>
                  <Link href="/memories" className="text-xs text-glassBlue hover:text-mintFoam transition-colors flex items-center gap-1">
                    View Memories <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-xl border border-mintFoam/20 bg-mintFoam/5">
                    <TrendingUp className="h-4 w-4 text-mintFoam mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-mintFoam">Peak Absorption Window</p>
                      <p className="text-[11px] text-softChrome/70 mt-0.5">
                        Your retention is 34% higher during morning deep review sessions.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl border border-chromeViolet/25 bg-chromeViolet/5">
                    <Brain className="h-4 w-4 text-glassBlue mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-glassBlue">Concept Link Identified</p>
                      <p className="text-[11px] text-softChrome/70 mt-0.5">
                        Strong neural cluster formed between System Architecture and AI Agents.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl border border-skinSand/25 bg-skinSand/5">
                    <Clock className="h-4 w-4 text-skinSand mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-skinSand">Spaced Review Scheduled</p>
                      <p className="text-[11px] text-softChrome/70 mt-0.5">
                        Upcoming revision suggested for 12 key concepts due tomorrow.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </Layout>
    </AuthGuard>
  );
}
