"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: "up" | "down" | "neutral";
  };
  icon: LucideIcon;
  description?: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  description,
  className,
}: StatsCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden p-5 transition-all duration-300 hover:border-chromeViolet/50 hover:shadow-card-hover hover:-translate-y-1 bg-gradient-to-b from-carbonTeal/90 to-carbonTeal/60 border-softChrome/10",
        className
      )}
    >
      {/* Ambient background hover glow */}
      <div className="absolute top-0 right-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-chromeViolet/15 blur-2xl group-hover:bg-chromeViolet/30 transition-all pointer-events-none" />

      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wider text-softChrome/60">
            {title}
          </p>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-softChrome font-mono">
            {value}
          </div>
        </div>

        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-toxicViolet/40 to-chromeViolet/25 border border-chromeViolet/30 flex items-center justify-center text-glassBlue group-hover:scale-110 group-hover:border-chromeViolet/60 shadow-glow-violet transition-all duration-300">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {(change || description) && (
        <div className="mt-4 flex items-center gap-2 pt-3 border-t border-softChrome/10 text-xs">
          {change && (
            <span
              className={cn(
                "inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full text-[11px]",
                change.trend === "up" && "bg-mintFoam/15 text-mintFoam border border-mintFoam/30 shadow-glow-mint",
                change.trend === "down" && "bg-rose-500/15 text-rose-400 border border-rose-500/25",
                change.trend === "neutral" && "bg-carbonTeal-surface text-softChrome/60"
              )}
            >
              {change.trend === "up" && <TrendingUp className="h-3 w-3" />}
              {change.trend === "down" && <TrendingDown className="h-3 w-3" />}
              {change.value}
            </span>
          )}
          {description && (
            <span className="text-softChrome/60 truncate">{description}</span>
          )}
        </div>
      )}
    </Card>
  );
}
