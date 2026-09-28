"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Brain,
  FileText,
  MessageSquare,
  Network,
  Clock,
  Settings,
  Upload,
  BarChart3,
  User,
  CreditCard,
  Mic,
  RotateCcw,
  Sparkles,
  Zap,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navSections: { sectionTitle: string; items: NavItem[] }[] = [
  {
    sectionTitle: "Workspace",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
      { name: "AI Chat", href: "/chat", icon: MessageSquare, badge: "AI" },
      { name: "Knowledge Graph", href: "/knowledge-graph", icon: Network },
      { name: "Documents", href: "/documents", icon: FileText },
    ],
  },
  {
    sectionTitle: "Memory & Capture",
    items: [
      { name: "Memories", href: "/memories", icon: Clock },
      { name: "Review Flashcards", href: "/review", icon: RotateCcw, badge: "Due" },
      { name: "Voice Note", href: "/voice", icon: Mic },
      { name: "Upload Content", href: "/upload", icon: Upload },
    ],
  },
  {
    sectionTitle: "System & Account",
    items: [
      { name: "Profile", href: "/profile", icon: User },
      { name: "Billing & Plans", href: "/billing", icon: CreditCard },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex h-full w-64 flex-col bg-carbonTeal/40 backdrop-blur-2xl border-r border-softChrome/10 relative z-20">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-softChrome/10">
        <Link href="/dashboard" className="flex items-center space-x-3 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-toxicViolet via-chromeViolet to-hyperCobalt p-0.5 shadow-glow-violet group-hover:scale-105 transition-all">
            <div className="h-full w-full bg-carbonTeal-dark rounded-[10px] flex items-center justify-center">
              <Brain className="h-5 w-5 text-glassBlue group-hover:text-mintFoam transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-base tracking-tight text-softChrome">Congicore</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-mintFoam/15 text-mintFoam border border-mintFoam/30">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-softChrome/60 tracking-wider uppercase font-medium">Knowledge Twin</p>
          </div>
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navSections.map((section) => (
          <div key={section.sectionTitle} className="space-y-1">
            <h3 className="px-3 text-[11px] font-semibold uppercase tracking-wider text-softChrome/50 mb-2">
              {section.sectionTitle}
            </h3>
            {section.items.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all group relative",
                    isActive
                      ? "text-glassBlue bg-gradient-to-r from-chromeViolet/25 via-hyperCobalt/20 to-transparent border border-chromeViolet/40 shadow-glow-sm"
                      : "text-softChrome/70 hover:text-glassBlue hover:bg-white/[0.05]"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-colors",
                        isActive
                          ? "text-glassBlue"
                          : "text-softChrome/60 group-hover:text-glassBlue"
                      )}
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-md font-semibold tracking-wide",
                        item.badge === "Due"
                          ? "bg-skinSand/20 text-skinSand border border-skinSand/30"
                          : isActive
                          ? "bg-chromeViolet text-white shadow-glow-sm"
                          : "bg-mintFoam/15 text-mintFoam border border-mintFoam/25"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* High-Tech Storage & Upgrade Card */}
      <div className="p-4 border-t border-softChrome/10">
        <div className="rounded-xl p-3.5 bg-gradient-to-b from-toxicViolet/30 to-carbonTeal/80 border border-chromeViolet/25 shadow-inner-glow relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-softChrome flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-mintFoam" />
              Storage Quota
            </span>
            <span className="text-[11px] font-mono text-mintFoam font-semibold">24%</span>
          </div>

          <div className="w-full bg-carbonTeal-dark rounded-full h-1.5 overflow-hidden mb-2 border border-softChrome/10">
            <div
              className="bg-gradient-to-r from-chromeViolet via-hyperCobalt to-mintFoam h-full rounded-full transition-all shadow-glow-sm"
              style={{ width: "24%" }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-softChrome/60">
            <span>2.4 GB / 10 GB</span>
            <Link
              href="/billing"
              className="text-glassBlue hover:text-mintFoam transition-colors flex items-center gap-0.5 font-medium"
            >
              <Sparkles className="h-3 w-3 text-skinSand" /> Upgrade
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
