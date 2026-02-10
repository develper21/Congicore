"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Search, 
  Bell, 
  User, 
  Moon, 
  Sun,
  Settings,
  LogOut,
  CreditCard,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const notifications = [
    {
      id: 1,
      title: "Document Processing Complete",
      description: "Machine Learning Basics.pdf has been processed",
      time: "5 minutes ago",
      type: "success",
      read: false
    },
    {
      id: 2,
      title: "AI Insight Available",
      description: "New learning pattern detected in your activity",
      time: "1 hour ago",
      type: "info",
      read: false
    },
    {
      id: 3,
      title: "Memory Review Due",
      description: "3 memories are ready for review",
      time: "2 hours ago",
      type: "warning",
      read: true
    }
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning": return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "info": return <Info className="h-4 w-4 text-blue-500" />
      default: return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center space-x-4 flex-1">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search your knowledge base..."
            className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full"></span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              <span className="text-xs text-muted-foreground">
                {unreadCount} unread
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-4">
                <div className="flex items-start space-x-3 w-full">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-sm text-primary">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">john.doe@example.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <a href="/profile" className="w-full">Profile</a>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <a href="/settings" className="w-full">Settings</a>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <a href="/billing" className="w-full">Billing</a>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              <a href="/support" className="w-full">Help & Support</a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
