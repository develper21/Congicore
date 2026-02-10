"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "AI Chat", href: "/chat", icon: MessageSquare },
  { name: "Knowledge Graph", href: "/graph", icon: Network },
  { name: "Memories", href: "/memories", icon: Clock },
  { name: "Upload", href: "/upload", icon: Upload },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r">
      <div className="flex h-16 items-center px-6 border-b">
        <div className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Knowledge Twin</span>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-secondary"
                )}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          )
        })}
      </nav>
      
      <div className="p-4 border-t">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-3">
          <p className="text-sm font-medium">Storage Used</p>
          <div className="mt-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>2.4 GB of 10 GB</span>
              <span>24%</span>
            </div>
            <div className="mt-1 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full w-1/4 bg-primary rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
