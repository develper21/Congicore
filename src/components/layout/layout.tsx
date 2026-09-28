"use client";

import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden relative selection:bg-primary/30 selection:text-white">
      {/* Ambient background glow orbs */}
      <div className="absolute -top-32 right-1/4 w-96 h-96 bg-chromeViolet/15 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-toxicViolet/25 rounded-full blur-[128px] pointer-events-none" />

      {/* Main Sidebar */}
      <Sidebar />

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
