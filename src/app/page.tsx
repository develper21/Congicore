"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Brain,
  FileText,
  MessageSquare,
  Network,
  Clock,
  ArrowRight,
  Shield,
  Zap,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Play,
  Layers,
  Search,
  Lock,
  Github,
  Twitter,
  Linkedin,
  Disc as Discord,
  Send,
  Check,
  Compass,
  Cpu,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden selection:bg-chromeViolet/30 selection:text-white">
      {/* Ambient background glows tailored to Carbon Teal (#042F32), Toxic Violet (#3D007A) & Chrome Violet (#5F2CFF) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-chromeViolet/20 via-toxicViolet/15 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-[750px] right-0 w-[550px] h-[550px] bg-carbonTeal-light/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[1500px] left-0 w-[650px] h-[650px] bg-toxicViolet/20 rounded-full blur-[160px] pointer-events-none" />

      {/* Navigation */}
      <nav className="border-b border-softChrome/10 bg-carbonTeal/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-toxicViolet via-chromeViolet to-hyperCobalt p-0.5 shadow-glow-violet group-hover:scale-105 transition-all">
                <div className="h-full w-full bg-carbonTeal-dark rounded-[14px] flex items-center justify-center">
                  <Brain className="h-5 w-5 text-glassBlue group-hover:text-mintFoam transition-colors" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-softChrome">Congicore</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-mintFoam/15 text-mintFoam border border-mintFoam/30 shadow-glow-mint">
                  AI 2.0
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-softChrome/70">
              <a href="#features" className="hover:text-glassBlue transition-colors">Features</a>
              <a href="#graph" className="hover:text-glassBlue transition-colors">Knowledge Graph</a>
              <a href="#spaced-repetition" className="hover:text-glassBlue transition-colors">Recall Engine</a>
              <Link href="/billing" className="hover:text-glassBlue transition-colors">Pricing</Link>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="text-sm font-medium text-softChrome/80 hover:text-glassBlue">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="shadow-glow-violet gap-1.5 font-semibold">
                  Get Started Free
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badge Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-gradient-to-r from-toxicViolet/40 via-chromeViolet/25 to-carbonTeal/40 border border-chromeViolet/40 shadow-glow-violet text-glassBlue">
            <Sparkles className="h-4 w-4 text-mintFoam animate-pulse" />
            <span>Introducing Congicore Knowledge Twin 2.0</span>
            <span className="text-softChrome/40">•</span>
            <span className="text-softChrome font-medium flex items-center">
              Explore RAG <ChevronRight className="h-3.5 w-3.5 ml-0.5 text-mintFoam" />
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-softChrome leading-[1.1]">
            Turn Fragmented Information into an{" "}
            <span className="gradient-text">Autonomous Second Brain</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-softChrome/75 max-w-3xl mx-auto leading-relaxed">
            Ingest PDFs, research papers, voice memos, and videos. Congicore connects concepts
            into an interactive 3D Knowledge Graph and delivers science-backed spaced repetition
            to supercharge your intellect.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            <Link href="/auth/register">
              <Button size="lg" className="h-14 px-8 text-base shadow-glow-violet gap-2 font-semibold">
                Start Building Your Twin
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="h-14 px-7 text-base gap-2 font-medium border-softChrome/15 text-softChrome hover:text-glassBlue">
                <Play className="h-4 w-4 text-glassBlue fill-glassBlue" />
                Explore Live Demo
              </Button>
            </Link>
          </div>

          {/* Micro Trust Proof */}
          <div className="pt-4 flex flex-wrap justify-center items-center gap-6 text-xs text-softChrome/70">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-mintFoam" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-mintFoam" /> End-to-end encrypted
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-mintFoam" /> Instant vector search
            </span>
          </div>

          {/* Interactive Hero Mockup Card */}
          <div className="pt-10">
            <div className="relative rounded-3xl p-2 sm:p-4 bg-gradient-to-b from-softChrome/10 via-carbonTeal/60 to-carbonTeal-dark border border-softChrome/15 shadow-2xl backdrop-blur-2xl">
              <div className="rounded-2xl bg-carbonTeal-dark/95 border border-softChrome/10 overflow-hidden p-6 sm:p-8">
                {/* Mockup Topbar */}
                <div className="flex items-center justify-between pb-6 border-b border-softChrome/10">
                  <div className="flex items-center space-x-2">
                    <span className="h-3 w-3 rounded-full bg-toxicViolet border border-chromeViolet/40" />
                    <span className="h-3 w-3 rounded-full bg-skinSand/80" />
                    <span className="h-3 w-3 rounded-full bg-mintFoam/90" />
                    <span className="ml-4 text-xs font-mono text-softChrome/50">congicore-twin // active-session</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-mintFoam/15 text-mintFoam border border-mintFoam/30 shadow-glow-mint">
                      Sync: 100%
                    </span>
                  </div>
                </div>

                {/* Mockup Preview Grid */}
                <div className="grid md:grid-cols-3 gap-6 pt-6 text-left">
                  {/* Left Column: Semantic Search & Q&A */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="p-4 rounded-xl bg-carbonTeal/40 border border-softChrome/10 flex items-center gap-3">
                      <Search className="h-4 w-4 text-glassBlue" />
                      <span className="text-sm text-softChrome/75 font-mono">
                        "What is the mathematical connection between attention heads and graph networks?"
                      </span>
                    </div>

                    <div className="p-5 rounded-2xl bg-gradient-to-b from-toxicViolet/30 to-carbonTeal/60 border border-chromeViolet/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4 text-glassBlue" />
                          <span className="text-xs font-semibold text-glassBlue">Congicore Cognitive Synthesis</span>
                        </div>
                        <span className="text-[10px] font-mono text-softChrome/50">Derived from 4 source files</span>
                      </div>
                      <p className="text-xs sm:text-sm text-softChrome/90 leading-relaxed">
                        Multi-head attention can be formulated as an edge-weighted graph convolution on a complete graph,
                        where the softmax affinity scores represent dynamic adjacency weights across node tokens.
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <span className="text-[10px] px-2.5 py-1 rounded-md bg-carbonTeal-surface/60 border border-softChrome/10 text-softChrome/80">
                          📄 Attention_Is_All_You_Need.pdf
                        </span>
                        <span className="text-[10px] px-2.5 py-1 rounded-md bg-carbonTeal-surface/60 border border-softChrome/10 text-softChrome/80">
                          📄 Graph_Neural_Nets.pdf
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Mini Graph & Memory Stats */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-carbonTeal/50 border border-softChrome/10 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-softChrome/70 flex items-center gap-1.5">
                          <Network className="h-3.5 w-3.5 text-glassBlue" /> Neural Nodes
                        </span>
                        <span className="font-mono text-softChrome font-semibold">1,248</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-softChrome/70 flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-skinSand" /> Retention Score
                        </span>
                        <span className="font-mono text-mintFoam font-semibold">94.2%</span>
                      </div>
                      <div className="h-1.5 bg-carbonTeal-dark rounded-full overflow-hidden border border-softChrome/10">
                        <div className="w-[94%] h-full bg-gradient-to-r from-chromeViolet via-hyperCobalt to-mintFoam rounded-full shadow-glow-sm" />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-gradient-to-br from-toxicViolet/30 to-carbonTeal/40 border border-chromeViolet/25 text-center">
                      <Zap className="h-6 w-6 text-skinSand mx-auto mb-2" />
                      <p className="text-xs font-semibold text-softChrome">Spaced Review Scheduled</p>
                      <p className="text-[11px] text-softChrome/60 mt-1">4 memories due today</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Strip */}
      <section className="border-y border-softChrome/10 bg-carbonTeal/50 backdrop-blur-md py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-softChrome font-mono">50K+</div>
            <p className="text-xs sm:text-sm text-softChrome/60 mt-1">Documents Indexed</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-mintFoam font-mono">99.4%</div>
            <p className="text-xs sm:text-sm text-softChrome/60 mt-1">Recall Accuracy</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-glassBlue font-mono">10x</div>
            <p className="text-xs sm:text-sm text-softChrome/60 mt-1">Memory Longevity</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-skinSand font-mono">&lt; 14ms</div>
            <p className="text-xs sm:text-sm text-softChrome/60 mt-1">Semantic Latency</p>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-chromeViolet/20 text-glassBlue border border-chromeViolet/35">
            <Layers className="h-3.5 w-3.5 text-mintFoam" /> Core Cognitive Capabilities
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-softChrome">
            Engineered for High-Performance Learners
          </h2>
          <p className="text-base sm:text-lg text-softChrome/70 leading-relaxed">
            Everything you need to turn vast unorganized information into actionable, permanent intelligence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Card className="group p-6 hover:border-chromeViolet/50 hover:shadow-card-hover transition-all bg-carbonTeal/60 border-softChrome/10">
            <div className="h-12 w-12 rounded-2xl bg-hyperCobalt/20 border border-hyperCobalt/30 flex items-center justify-center text-glassBlue mb-5 group-hover:scale-110 transition-transform">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-softChrome mb-2">Multi-Modal Ingestion</h3>
            <p className="text-sm text-softChrome/65 leading-relaxed">
              Upload PDFs, docx, audio notes, and OCR images. Our vector pipeline strips noise and constructs
              hierarchical semantic embeddings automatically.
            </p>
          </Card>

          {/* Card 2 */}
          <Card className="group p-6 hover:border-chromeViolet/50 hover:shadow-card-hover transition-all bg-carbonTeal/60 border-softChrome/10">
            <div className="h-12 w-12 rounded-2xl bg-chromeViolet/25 border border-chromeViolet/40 flex items-center justify-center text-glassBlue mb-5 group-hover:scale-110 transition-transform">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-softChrome mb-2">Conversational Synthesis</h3>
            <p className="text-sm text-softChrome/65 leading-relaxed">
              Converse with your knowledge base using state-of-the-art LLMs. Get synthesized answers with direct
              footnotes and citations to your original files.
            </p>
          </Card>

          {/* Card 3 */}
          <Card className="group p-6 hover:border-chromeViolet/50 hover:shadow-card-hover transition-all bg-carbonTeal/60 border-softChrome/10">
            <div className="h-12 w-12 rounded-2xl bg-mintFoam/15 border border-mintFoam/30 flex items-center justify-center text-mintFoam mb-5 group-hover:scale-110 transition-transform">
              <Network className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-softChrome mb-2">Knowledge Graph Network</h3>
            <p className="text-sm text-softChrome/65 leading-relaxed">
              Visualize how distinct ideas cross-pollinate. Interactive D3 graphs uncover surprising links between
              unrelated research papers and notes.
            </p>
          </Card>

          {/* Card 4 */}
          <Card className="group p-6 hover:border-chromeViolet/50 hover:shadow-card-hover transition-all bg-carbonTeal/60 border-softChrome/10">
            <div className="h-12 w-12 rounded-2xl bg-skinSand/15 border border-skinSand/30 flex items-center justify-center text-skinSand mb-5 group-hover:scale-110 transition-transform">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-softChrome mb-2">SuperMemo-2 Spaced Recall</h3>
            <p className="text-sm text-softChrome/65 leading-relaxed">
              Scientifically engineered intervals calculate the exact moment you are about to forget a concept,
              serving flashcards for permanent retention.
            </p>
          </Card>

          {/* Card 5 */}
          <Card className="group p-6 hover:border-chromeViolet/50 hover:shadow-card-hover transition-all bg-carbonTeal/60 border-softChrome/10">
            <div className="h-12 w-12 rounded-2xl bg-toxicViolet/50 border border-chromeViolet/30 flex items-center justify-center text-glassBlue mb-5 group-hover:scale-110 transition-transform">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-softChrome mb-2">Cognitive Gap Detection</h3>
            <p className="text-sm text-softChrome/65 leading-relaxed">
              AI monitors your recall accuracy and flags areas of fragile understanding, proactively recommending
              supplementary review material.
            </p>
          </Card>

          {/* Card 6 */}
          <Card className="group p-6 hover:border-chromeViolet/50 hover:shadow-card-hover transition-all bg-carbonTeal/60 border-softChrome/10">
            <div className="h-12 w-12 rounded-2xl bg-mintFoam/15 border border-mintFoam/30 flex items-center justify-center text-mintFoam mb-5 group-hover:scale-110 transition-transform">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-softChrome mb-2">Zero-Trust Privacy Vault</h3>
            <p className="text-sm text-softChrome/65 leading-relaxed">
              Your personal data and knowledge remain strictly yours. Encrypted at rest, in transit, and never
              used to train public foundation models.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto rounded-3xl p-8 sm:p-14 bg-gradient-to-b from-toxicViolet/50 via-carbonTeal/80 to-carbonTeal-dark border border-chromeViolet/35 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-chromeViolet/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-softChrome tracking-tight">
              Ready to Upgrade Your Brain?
            </h2>
            <p className="text-base sm:text-lg text-softChrome/70 max-w-xl mx-auto leading-relaxed">
              Join researchers, engineers, and lifelong learners building their personal AI Knowledge Twins today.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/register">
                <Button size="lg" className="h-14 px-8 text-base shadow-glow-violet gap-2 font-semibold">
                  Get Started for Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="h-14 px-8 text-base font-medium border-softChrome/15 text-softChrome hover:text-glassBlue">
                  Sign In to Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Full-Featured Modern Luxury Footer */}
      <footer className="border-t border-softChrome/10 bg-carbonTeal-dark relative overflow-hidden">
        {/* Ambient Footer Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-t from-chromeViolet/10 via-toxicViolet/10 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
          {/* Top Footer: Brand + Newsletter */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-14 border-b border-softChrome/10">
            {/* Brand column */}
            <div className="lg:col-span-5 space-y-4">
              <Link href="/" className="flex items-center space-x-3 group inline-flex">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-toxicViolet via-chromeViolet to-hyperCobalt p-0.5 shadow-glow-violet group-hover:scale-105 transition-all">
                  <div className="h-full w-full bg-carbonTeal-dark rounded-[14px] flex items-center justify-center">
                    <Brain className="h-5 w-5 text-glassBlue" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold tracking-tight text-softChrome">Congicore</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-mintFoam/15 text-mintFoam border border-mintFoam/30">
                    Twin 2.0
                  </span>
                </div>
              </Link>
              <p className="text-sm text-softChrome/65 max-w-sm leading-relaxed">
                The world's premier neural cognitive twin. Unifying multi-modal knowledge ingestion,
                interactive vector graphs, and adaptive SuperMemo retention for curious minds.
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Congicore GitHub"
                  className="h-9 w-9 rounded-xl border border-softChrome/15 bg-carbonTeal/40 flex items-center justify-center text-softChrome/70 hover:text-glassBlue hover:border-chromeViolet/50 transition-all"
                >
                  <Github className="h-4 w-4" />
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Congicore Twitter"
                  className="h-9 w-9 rounded-xl border border-softChrome/15 bg-carbonTeal/40 flex items-center justify-center text-softChrome/70 hover:text-glassBlue hover:border-chromeViolet/50 transition-all"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Congicore Discord"
                  className="h-9 w-9 rounded-xl border border-softChrome/15 bg-carbonTeal/40 flex items-center justify-center text-softChrome/70 hover:text-glassBlue hover:border-chromeViolet/50 transition-all"
                >
                  <Discord className="h-4 w-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Congicore LinkedIn"
                  className="h-9 w-9 rounded-xl border border-softChrome/15 bg-carbonTeal/40 flex items-center justify-center text-softChrome/70 hover:text-glassBlue hover:border-chromeViolet/50 transition-all"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Newsletter Column */}
            <div className="lg:col-span-7 rounded-2xl p-6 sm:p-7 bg-gradient-to-r from-toxicViolet/20 to-carbonTeal/60 border border-chromeViolet/25 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-mintFoam/15 text-mintFoam border border-mintFoam/30 mb-2">
                  <Sparkles className="h-3 w-3" /> Cognitive AI Dispatch
                </div>
                <h4 className="text-base font-semibold text-softChrome">
                  Stay ahead with our weekly research synthesis
                </h4>
                <p className="text-xs text-softChrome/65 mt-1 leading-relaxed">
                  Deep dives on vector retrieval, active recall science, and autonomous second brain workflows.
                  No spam, unsubscribe anytime.
                </p>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-carbonTeal-dark/80 border border-softChrome/15 rounded-xl text-softChrome placeholder:text-softChrome/40 focus:outline-none focus:border-chromeViolet/50 focus:ring-2 focus:ring-chromeViolet/25 transition-all"
                />
                <Button size="sm" className="h-10 px-5 text-xs font-semibold shadow-glow-violet gap-1.5 shrink-0">
                  <span>Subscribe</span>
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Middle Footer: Multi-Column Sitemap */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-softChrome/10 text-xs">
            {/* Col 1: Product */}
            <div className="space-y-3">
              <h5 className="font-semibold text-softChrome tracking-wider uppercase text-[11px] flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-glassBlue" /> Product
              </h5>
              <ul className="space-y-2 text-softChrome/65">
                <li><Link href="/dashboard" className="hover:text-glassBlue transition-colors">Knowledge Twin</Link></li>
                <li><Link href="/chat" className="hover:text-glassBlue transition-colors">AI Synthesis Chat</Link></li>
                <li><Link href="/knowledge-graph" className="hover:text-glassBlue transition-colors">3D Graph Explorer</Link></li>
                <li><Link href="/review" className="hover:text-glassBlue transition-colors">SuperMemo Flashcards</Link></li>
                <li><Link href="/upload" className="hover:text-glassBlue transition-colors">Multi-Modal Ingest</Link></li>
                <li><Link href="/voice" className="hover:text-glassBlue transition-colors">Voice Note Synthesis</Link></li>
              </ul>
            </div>

            {/* Col 2: Solutions */}
            <div className="space-y-3">
              <h5 className="font-semibold text-softChrome tracking-wider uppercase text-[11px] flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-mintFoam" /> Solutions
              </h5>
              <ul className="space-y-2 text-softChrome/65">
                <li><Link href="/solutions/research" className="hover:text-mintFoam transition-colors">Academic Researchers</Link></li>
                <li><Link href="/solutions/engineers" className="hover:text-mintFoam transition-colors">Software Architects</Link></li>
                <li><Link href="/solutions/medical" className="hover:text-mintFoam transition-colors">Medical & Clinical</Link></li>
                <li><Link href="/solutions/legal" className="hover:text-mintFoam transition-colors">Legal Discovery</Link></li>
                <li><Link href="/solutions/learners" className="hover:text-mintFoam transition-colors">Lifelong Learners</Link></li>
                <li><Link href="/billing" className="hover:text-mintFoam transition-colors">Enterprise Vaults</Link></li>
              </ul>
            </div>

            {/* Col 3: Resources */}
            <div className="space-y-3">
              <h5 className="font-semibold text-softChrome tracking-wider uppercase text-[11px] flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-skinSand" /> Resources
              </h5>
              <ul className="space-y-2 text-softChrome/65">
                <li><Link href="/support" className="hover:text-skinSand transition-colors">Documentation</Link></li>
                <li><Link href="/support#api" className="hover:text-skinSand transition-colors">API Reference</Link></li>
                <li><Link href="/billing" className="hover:text-skinSand transition-colors">Pricing & Limits</Link></li>
                <li><Link href="/support#status" className="hover:text-skinSand transition-colors">System Uptime</Link></li>
                <li><Link href="/support#changelog" className="hover:text-skinSand transition-colors">Changelog & Releases</Link></li>
                <li><Link href="/support" className="hover:text-skinSand transition-colors">Community Forum</Link></li>
              </ul>
            </div>

            {/* Col 4: Trust & Security */}
            <div className="space-y-3">
              <h5 className="font-semibold text-softChrome tracking-wider uppercase text-[11px] flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-chromeViolet-light" /> Security & Legal
              </h5>
              <ul className="space-y-2 text-softChrome/65">
                <li><Link href="/settings" className="hover:text-glassBlue transition-colors">Zero-Knowledge Architecture</Link></li>
                <li><Link href="/settings" className="hover:text-glassBlue transition-colors">Privacy Policy</Link></li>
                <li><Link href="/settings" className="hover:text-glassBlue transition-colors">Terms of Service</Link></li>
                <li><Link href="/settings" className="hover:text-glassBlue transition-colors">Data Encryption Standards</Link></li>
                <li><Link href="/settings" className="hover:text-glassBlue transition-colors">GDPR & SOC-2 Compliance</Link></li>
                <li><Link href="/settings" className="hover:text-glassBlue transition-colors">Security Whitepaper</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Copyright, Status Pill & Trust Badges */}
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-softChrome/60">
            <div className="flex items-center space-x-2">
              <span>© {new Date().getFullYear()} Congicore AI Systems Inc. All rights reserved.</span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mintFoam/10 border border-mintFoam/25 text-mintFoam font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-mintFoam animate-pulse" />
                All Systems Operational (99.98%)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-skinSand/10 border border-skinSand/25 text-skinSand font-medium">
                <Lock className="h-3 w-3" />
                AES-256 Vector Vault
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
