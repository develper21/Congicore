"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  FileText, 
  MessageSquare, 
  Network, 
  Clock,
  ArrowRight
} from "lucide-react"

const activities = [
  {
    id: 1,
    type: "document",
    title: "Machine Learning Basics.pdf",
    description: "Processed and indexed 15 concepts",
    time: "2 hours ago",
    icon: FileText
  },
  {
    id: 2,
    type: "chat",
    title: "AI Conversation",
    description: "Discussed neural networks and deep learning",
    time: "4 hours ago",
    icon: MessageSquare
  },
  {
    id: 3,
    type: "graph",
    title: "Knowledge Graph Updated",
    description: "Added 8 new connections between concepts",
    time: "6 hours ago",
    icon: Network
  },
  {
    id: 4,
    type: "memory",
    title: "Memory Review",
    description: "Reviewed 12 flashcards for retention",
    time: "1 day ago",
    icon: Clock
  }
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Activity</CardTitle>
        <Button variant="ghost" size="sm">
          View All
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <activity.icon className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-none">
                  {activity.title}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
