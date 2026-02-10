"use client"

import { Layout } from "@/components/layout/layout"
import { AuthGuard } from "@/components/auth/auth-guard"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { NotificationDemo } from "@/components/notifications/notification-demo"
import { 
  FileText, 
  MessageSquare, 
  Network, 
  Brain,
  TrendingUp,
  Clock
} from "lucide-react"

export default function DashboardPage() {
  return (
    <AuthGuard>
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's an overview of your AI Knowledge Twin.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Documents"
              value="248"
              change={{ value: "+12%", trend: "up" }}
              icon={FileText}
              description="from last month"
            />
            <StatsCard
              title="AI Conversations"
              value="1,429"
              change={{ value: "+23%", trend: "up" }}
              icon={MessageSquare}
              description="from last week"
            />
            <StatsCard
              title="Knowledge Graph Nodes"
              value="3,847"
              change={{ value: "+156", trend: "up" }}
              icon={Network}
              description="new connections"
            />
            <StatsCard
              title="Memory Retention"
              value="87%"
              change={{ value: "+5%", trend: "up" }}
              icon={Brain}
              description="average score"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RecentActivity />
            </div>
            <div>
              <QuickActions />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Knowledge Growth</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">This Week</span>
                  <span className="text-sm font-medium">+23 documents</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">This Month</span>
                  <span className="text-sm font-medium">+89 documents</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="text-sm font-medium">248 documents</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden mt-4">
                  <div className="h-full w-3/4 bg-gradient-to-r from-primary to-primary/60 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">AI Insights</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Learning Pattern Detected</p>
                    <p className="text-xs text-muted-foreground">
                      You're most productive in the morning hours
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Brain className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Knowledge Gap Found</p>
                    <p className="text-xs text-muted-foreground">
                      Consider exploring more about quantum computing
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Review Recommended</p>
                    <p className="text-xs text-muted-foreground">
                      12 memories need reinforcement
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <NotificationDemo />
        </div>
      </Layout>
    </AuthGuard>
  )
}
