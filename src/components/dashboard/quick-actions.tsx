"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileAudio,
  FileVideo,
  Upload,
  MessageSquare,
  Brain,
  Network,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export function QuickActions() {
  const quickActions = [
    {
      href: "/upload",
      title: "Upload Knowledge",
      description: "PDF, docs, audio, video",
      icon: Upload,
      gradient: "from-chromeViolet/20 to-hyperCobalt/20 border-chromeViolet/30 text-glassBlue group-hover:border-chromeViolet/60",
      accent: "text-glassBlue",
    },
    {
      href: "/chat",
      title: "AI Synthesis",
      description: "Chat with your knowledge",
      icon: MessageSquare,
      gradient: "from-hyperCobalt/20 to-toxicViolet/20 border-hyperCobalt/30 text-glassBlue group-hover:border-hyperCobalt/60",
      accent: "text-glassBlue",
    },
    {
      href: "/knowledge-graph",
      title: "Explore Graph",
      description: "Visualize concept links",
      icon: Network,
      gradient: "from-carbonTeal-surface/40 to-mintFoam/20 border-mintFoam/30 text-mintFoam group-hover:border-mintFoam/60",
      accent: "text-mintFoam",
    },
    {
      href: "/review",
      title: "Spaced Review",
      description: "Reinforce key memories",
      icon: Brain,
      gradient: "from-toxicViolet/25 to-skinSand/20 border-skinSand/30 text-skinSand group-hover:border-skinSand/60",
      accent: "text-skinSand",
    },
  ];

  return (
    <Card className="h-full flex flex-col justify-between border-softChrome/10 bg-carbonTeal/60">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 text-softChrome">
            <Sparkles className="h-4 w-4 text-chromeViolet" />
            Quick Actions
          </CardTitle>
          <span className="text-[11px] font-mono text-softChrome/50 uppercase">Fast Access</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="group relative flex flex-col p-4 rounded-xl border border-softChrome/10 bg-carbonTeal/40 hover:bg-carbonTeal-surface/60 hover:border-chromeViolet/40 hover:shadow-card-hover transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2.5 rounded-xl border ${action.gradient} transition-all duration-300`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-softChrome/40 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
                <h4 className="text-sm font-semibold text-softChrome group-hover:text-glassBlue transition-colors">
                  {action.title}
                </h4>
                <p className="text-xs text-softChrome/60 mt-0.5 leading-relaxed">
                  {action.description}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Quick upload shortcuts */}
        <div className="pt-3 border-t border-softChrome/10 flex items-center justify-between text-xs text-softChrome/60">
          <span>Direct drop:</span>
          <div className="flex items-center gap-2">
            <Link
              href="/upload?type=audio"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-carbonTeal-surface/50 hover:bg-carbonTeal-surface border border-softChrome/10 hover:border-glassBlue/30 text-softChrome hover:text-glassBlue transition-colors"
            >
              <FileAudio className="h-3.5 w-3.5 text-glassBlue" />
              <span>Audio</span>
            </Link>
            <Link
              href="/upload?type=video"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-carbonTeal-surface/50 hover:bg-carbonTeal-surface border border-softChrome/10 hover:border-mintFoam/30 text-softChrome hover:text-mintFoam transition-colors"
            >
              <FileVideo className="h-3.5 w-3.5 text-mintFoam" />
              <span>Video</span>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
