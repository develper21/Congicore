"use client";

import { useState, useEffect } from "react";
import { useNotifications } from "./notification-provider";
import { Notification, NotificationTheme } from "./types";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  FileText,
  MessageSquare,
  Brain,
  Settings,
  X,
} from "lucide-react";

interface NotificationItemProps {
  notification: Notification;
  theme: NotificationTheme;
  className: string;
}

const typeIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  document: FileText,
  chat: MessageSquare,
  memory: Brain,
  system: Settings,
};

const typeColors = {
  success: "text-mintFoam",
  error: "text-rose-400",
  warning: "text-skinSand",
  info: "text-glassBlue",
  document: "text-chromeViolet",
  chat: "text-hyperCobalt",
  memory: "text-glassBlue",
  system: "text-softChrome",
};

const themeTextColors = {
  default: "text-foreground",
  minimal: "text-foreground",
  colorful: "text-softChrome",
  glass: "text-softChrome",
  neon: "text-glassBlue",
  retro: "text-black",
};

const themeTitleColors = {
  default: "font-semibold text-foreground",
  minimal: "font-medium text-foreground",
  colorful: "font-bold text-chromeViolet",
  glass: "font-semibold text-white",
  neon: "font-bold text-mintFoam",
  retro: "font-bold text-black",
};

export function NotificationItem({
  notification,
  theme,
  className,
}: NotificationItemProps) {
  const { removeNotification } = useNotifications();
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const Icon = typeIcons[notification.type] || Info;
  const iconColor = typeColors[notification.type];
  const textColor = themeTextColors[theme];
  const titleColor = themeTitleColors[theme];

  useEffect(() => {
    // Trigger enter animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => {
      removeNotification(notification.id);
    }, 300);
  };

  const handleAction = () => {
    if (notification.action) {
      notification.action.onClick();
    }
    handleRemove();
  };

  const animationClasses = {
    enter: "transform translate-x-full opacity-0",
    visible: "transform translate-x-0 opacity-100",
    exit: "transform translate-x-full opacity-0",
  };

  const currentAnimation = isLeaving
    ? animationClasses.exit
    : isVisible
      ? animationClasses.visible
      : animationClasses.enter;

  return (
    <div
      className={`${className} ${currentAnimation} transition-all duration-300 ease-in-out`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className={`flex-shrink-0 ${iconColor}`}>
            {notification.icon || <Icon className="h-5 w-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm ${titleColor} truncate`}>
              {notification.title}
            </h4>
            {notification.message && (
              <p className={`text-xs ${textColor} mt-1 opacity-80`}>
                {notification.message}
              </p>
            )}
            {notification.action && (
              <Button
                variant={theme === "neon" ? "outline" : "ghost"}
                size="sm"
                onClick={handleAction}
                className="mt-2 text-xs"
              >
                {notification.action.label}
              </Button>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          className={`flex-shrink-0 h-6 w-6 p-0 ${textColor} opacity-60 hover:opacity-100`}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      {/* Progress bar for auto-dismiss */}
      {notification.duration !== 0 && (
        <div className="mt-2 h-1 bg-muted/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary/60 rounded-full"
            style={{
              animation: `shrink ${notification.duration || 5000}ms linear forwards`,
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
