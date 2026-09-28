"use client";

import { useEffect, useState } from "react";
import { useNotifications } from "./notification-provider";
import { NotificationItem } from "./notification-item";
import { NotificationTheme } from "./types";

const themeStyles = {
  default: {
    container: "fixed top-4 right-4 z-50 space-y-2",
    item: "bg-background border border-border shadow-lg rounded-lg p-4 min-w-[300px] max-w-[400px]",
  },
  minimal: {
    container: "fixed top-4 right-4 z-50 space-y-1",
    item: "bg-background/90 backdrop-blur border-l-4 border-l-primary shadow-sm rounded p-3 min-w-[250px] max-w-[350px]",
  },
  colorful: {
    container: "fixed top-4 right-4 z-50 space-y-3",
    item: "bg-gradient-to-r from-primary/10 to-secondary/10 border-0 shadow-xl rounded-xl p-4 min-w-[320px] max-w-[420px]",
  },
  glass: {
    container: "fixed top-4 right-4 z-50 space-y-2",
    item: "glass-effect border border-white/20 shadow-2xl rounded-xl p-4 min-w-[300px] max-w-[400px]",
  },
  neon: {
    container: "fixed top-4 right-4 z-50 space-y-3",
    item: "bg-[#021618] border border-mintFoam shadow-[0_0_20px_rgba(214,255,203,0.3)] rounded-lg p-4 min-w-[320px] max-w-[420px]",
  },
  retro: {
    container: "fixed top-4 right-4 z-50 space-y-2",
    item: "bg-yellow-100 border-4 border-black shadow-lg rounded-none p-4 min-w-[300px] max-w-[400px]",
  },
};

export function NotificationContainer() {
  const { notifications, theme } = useNotifications();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = themeStyles[theme];

  return (
    <div className={currentTheme.container}>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          theme={theme}
          className={currentTheme.item}
        />
      ))}
    </div>
  );
}
