"use client";

import { useNotifications } from "./notification-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  FileText,
  MessageSquare,
  Brain,
  Settings,
  Palette,
} from "lucide-react";

export function NotificationDemo() {
  const { addNotification, setTheme, theme } = useNotifications();

  const notifications = [
    {
      title: "Document Processed",
      message:
        "Machine Learning Basics.pdf has been successfully processed and indexed.",
      type: "success" as const,
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    },
    {
      title: "Upload Failed",
      message:
        "Unable to process the uploaded file. Please check the format and try again.",
      type: "error" as const,
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
    },
    {
      title: "Storage Warning",
      message:
        "You're running low on storage space. Consider upgrading your plan.",
      type: "warning" as const,
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
      action: {
        label: "Upgrade Now",
        onClick: () => console.log("Upgrade clicked"),
      },
    },
    {
      title: "AI Insight Available",
      message: "New learning pattern detected in your recent activity.",
      type: "info" as const,
      icon: <Info className="h-5 w-5 text-blue-500" />,
    },
    {
      title: "New Document Added",
      message: "Research Paper.pdf has been added to your knowledge base.",
      type: "document" as const,
      icon: <FileText className="h-5 w-5 text-purple-500" />,
    },
    {
      title: "Chat Response Ready",
      message: "Your AI twin has prepared a response to your query.",
      type: "chat" as const,
      icon: <MessageSquare className="h-5 w-5 text-indigo-500" />,
    },
    {
      title: "Memory Review Due",
      message: "3 memories are ready for review to improve retention.",
      type: "memory" as const,
      icon: <Brain className="h-5 w-5 text-pink-500" />,
      action: {
        label: "Review Now",
        onClick: () => console.log("Review clicked"),
      },
    },
    {
      title: "System Update",
      message: "New features have been added to your knowledge twin.",
      type: "system" as const,
      icon: <Settings className="h-5 w-5 text-gray-500" />,
    },
  ];

  const themes = [
    { name: "Default", value: "default" as const },
    { name: "Minimal", value: "minimal" as const },
    { name: "Colorful", value: "colorful" as const },
    { name: "Glass", value: "glass" as const },
    { name: "Neon", value: "neon" as const },
    { name: "Retro", value: "retro" as const },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Palette className="mr-2 h-5 w-5" />
          Notification System Demo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-3">Current Theme: {theme}</h3>
          <div className="grid grid-cols-3 gap-2">
            {themes.map((t) => (
              <Button
                key={t.value}
                variant={theme === t.value ? "secondary" : "outline"}
                size="sm"
                onClick={() => setTheme(t.value)}
                className="text-xs"
              >
                {t.name}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Test Notifications</h3>
          <div className="grid grid-cols-2 gap-2">
            {notifications.map((notification, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => addNotification(notification)}
                className="text-xs justify-start"
              >
                {notification.title}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Special Notifications</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                addNotification({
                  title: "Persistent Notification",
                  message:
                    "This notification won't auto-dismiss. Click the X to close it.",
                  type: "info",
                  duration: 0,
                })
              }
              className="text-xs"
            >
              Persistent Notification
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                addNotification({
                  title: "Quick Success",
                  type: "success",
                  duration: 2000,
                })
              }
              className="text-xs"
            >
              Quick Success (2s)
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
