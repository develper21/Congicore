"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { api } from "@/lib/api";
import {
  FileText,
  MessageSquare,
  Network,
  Clock,
  ArrowRight,
  Loader2,
  Activity,
} from "lucide-react";

interface ActivityItem {
  _id: string;
  title: string;
  description: string;
  type: "document" | "chat" | "graph" | "memory";
  time: string;
}

const getActivityBadge = (type: string) => {
  switch (type) {
    case "document":
      return { icon: FileText, label: "Document", color: "text-glassBlue bg-hyperCobalt/15 border-hyperCobalt/30" };
    case "chat":
      return { icon: MessageSquare, label: "AI Chat", color: "text-glassBlue bg-chromeViolet/20 border-chromeViolet/35" };
    case "graph":
      return { icon: Network, label: "Graph Node", color: "text-mintFoam bg-mintFoam/15 border-mintFoam/30" };
    case "memory":
      return { icon: Clock, label: "Memory", color: "text-skinSand bg-skinSand/15 border-skinSand/30" };
    default:
      return { icon: Activity, label: "Event", color: "text-softChrome bg-softChrome/10 border-softChrome/20" };
  }
};

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getStats();
      setActivities(response.stats?.recentActivities || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch activities");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full border-softChrome/10 bg-carbonTeal/60">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-chromeViolet" />
          <CardTitle className="text-lg text-softChrome">Recent Neural Activity</CardTitle>
        </div>
        <Link href="/documents">
          <Button variant="ghost" size="sm" className="text-xs text-glassBlue hover:text-mintFoam gap-1">
            View All
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-softChrome/60 gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-chromeViolet" />
            <span className="text-xs">Loading activity stream...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-rose-400 text-xs mb-3">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchActivities}>
              Retry
            </Button>
          </div>
        ) : activities.length === 0 ? (
          <EmptyState
            icon={Activity}
            title="No activity recorded yet"
            description="Upload your first document or start an AI chat session to see live insights"
          />
        ) : (
          <div className="space-y-3">
            {activities.map((act) => {
              const badge = getActivityBadge(act.type);
              const Icon = badge.icon;
              return (
                <div
                  key={act._id}
                  className="group flex items-start gap-3.5 p-3 rounded-xl border border-softChrome/10 bg-carbonTeal/40 hover:bg-carbonTeal-surface/60 hover:border-chromeViolet/40 transition-all"
                >
                  <div className={`p-2 rounded-xl border ${badge.color} flex-shrink-0 mt-0.5`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-softChrome truncate group-hover:text-glassBlue transition-colors">
                        {act.title}
                      </p>
                      <span className="text-[10px] text-softChrome/50 font-mono flex-shrink-0">
                        {new Date(act.time).toLocaleDateString([], { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <p className="text-xs text-softChrome/60 mt-0.5 line-clamp-1">
                      {act.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
