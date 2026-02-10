"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Upload, 
  MessageSquare, 
  Search, 
  Plus,
  FileAudio,
  FileVideo
} from "lucide-react"

const quickActions = [
  {
    title: "Upload Document",
    description: "Add PDFs, notes, or recordings",
    icon: Upload,
    action: "upload",
    color: "bg-blue-500 hover:bg-blue-600"
  },
  {
    title: "Chat with AI",
    description: "Ask questions about your knowledge",
    icon: MessageSquare,
    action: "chat",
    color: "bg-purple-500 hover:bg-purple-600"
  },
  {
    title: "Search Knowledge",
    description: "Find information instantly",
    icon: Search,
    action: "search",
    color: "bg-green-500 hover:bg-green-600"
  },
  {
    title: "Add Memory",
    description: "Create new knowledge entry",
    icon: Plus,
    action: "add",
    color: "bg-orange-500 hover:bg-orange-600"
  }
]

export function QuickActions() {
  const handleAction = (action: string) => {
    console.log(`Action triggered: ${action}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.action}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2 hover:border-primary"
              onClick={() => handleAction(action.action)}
            >
              <div className={`p-2 rounded-lg ${action.color} text-white`}>
                <action.icon className="h-5 w-5" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">{action.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {action.description}
                </p>
              </div>
            </Button>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Quick upload:</span>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">
                <FileAudio className="h-4 w-4 mr-1" />
                Audio
              </Button>
              <Button variant="ghost" size="sm">
                <FileVideo className="h-4 w-4 mr-1" />
                Video
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
