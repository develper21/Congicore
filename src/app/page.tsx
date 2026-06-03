"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Brain,
  FileText,
  MessageSquare,
  Network,
  Clock,
  ArrowRight,
  Shield,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Knowledge Twin</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Your AI-Powered
            <span className="text-primary"> Second Brain</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Transform how you learn and remember. Build a lifelong knowledge
            base that evolves with you, powered by intelligent AI that
            understands your unique learning style.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Master Knowledge
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you learn faster, remember
              longer, and connect ideas better.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="mb-2">Smart Document Processing</CardTitle>
              <CardContent>
                <p className="text-muted-foreground">
                  Upload PDFs, audio, video and more. AI extracts key concepts
                  and builds connections automatically.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="mb-2">AI Conversational Learning</CardTitle>
              <CardContent>
                <p className="text-muted-foreground">
                  Chat with your knowledge base. Ask questions, get summaries,
                  and explore connections naturally.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <Network className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="mb-2">
                Knowledge Graph Visualization
              </CardTitle>
              <CardContent>
                <p className="text-muted-foreground">
                  See how your ideas connect. Interactive graphs reveal patterns
                  and insights you might miss.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="mb-2">Spaced Repetition</CardTitle>
              <CardContent>
                <p className="text-muted-foreground">
                  Science-backed memory system. Review at the perfect time for
                  maximum retention.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="mb-2">Predictive Insights</CardTitle>
              <CardContent>
                <p className="text-muted-foreground">
                  AI learns your patterns and suggests what to review next,
                  keeping you ahead of the curve.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="mb-2">Privacy-First Design</CardTitle>
              <CardContent>
                <p className="text-muted-foreground">
                  Your knowledge stays yours. Optional on-device processing
                  keeps your data private and secure.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of learners who&apos;ve already built their AI
            knowledge twins.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="text-lg px-8 py-3">
              Start Building Your Knowledge Twin
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Brain className="h-6 w-6 text-primary" />
              <span className="font-bold">Knowledge Twin</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Knowledge Twin. Built for lifelong learners.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
