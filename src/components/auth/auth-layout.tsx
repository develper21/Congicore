"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Brain, ArrowLeft } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden p-4 sm:p-6 selection:bg-primary/30 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-chromeViolet/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-toxicViolet/25 rounded-full blur-[120px] pointer-events-none" />

      {/* Back to Home Button */}
      <div className="w-full max-w-md mb-6 flex justify-between items-center relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-softChrome transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Congicore
        </Link>
        <span className="text-[11px] font-mono text-muted-foreground/60 border border-white/[0.08] px-2 py-0.5 rounded-full bg-carbonTeal/40 text-glassBlue">v2.4 Secured</span>
      </div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-3 group">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-chromeViolet via-hyperCobalt to-glassBlue p-0.5 shadow-glow-violet group-hover:shadow-glow-cobalt transition-all">
              <div className="h-full w-full bg-[#021618] rounded-[14px] flex items-center justify-center">
                <Brain className="h-6 w-6 text-glassBlue group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </Link>
          {title && (
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Form Card Container */}
        {children}
      </div>
    </div>
  );
}
