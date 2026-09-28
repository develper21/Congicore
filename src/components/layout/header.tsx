"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  CreditCard,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Info,
  Sparkles,
  Upload,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Notification {
  _id: string;
  title: string;
  description: string;
  type: "success" | "warning" | "info" | "error";
  read: boolean;
  time: string;
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

export function Header() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userData, setUserData] = useState<UserData>({
    firstName: "Knowledge",
    lastName: "Explorer",
    email: "user@congicore.ai",
  });

  const fetchUserData = async () => {
    try {
      const response = await api.getProfile();
      if (response && response.profile) {
        setUserData({
          firstName: response.profile.firstName || "Knowledge",
          lastName: response.profile.lastName || "Explorer",
          email: response.profile.email || "user@congicore.ai",
        });
      }
    } catch {
      // Default fallback
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      router.push("/auth/login");
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-mintFoam" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-skinSand" />;
      case "info":
        return <Info className="h-4 w-4 text-glassBlue" />;
      default:
        return <Info className="h-4 w-4 text-chromeViolet-light" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="flex h-16 items-center justify-between border-b border-softChrome/10 bg-carbonTeal/50 backdrop-blur-xl px-4 md:px-6 sticky top-0 z-30">
      {/* Search Input with Keyboard Badge */}
      <div className="flex items-center space-x-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-softChrome/50" />
          <input
            type="text"
            placeholder="Search documents, concepts, AI memories..."
            className="w-full pl-10 pr-12 py-2 text-sm bg-carbonTeal-surface/40 border border-softChrome/10 rounded-xl text-softChrome placeholder:text-softChrome/40 focus:outline-none focus:border-chromeViolet/50 focus:ring-2 focus:ring-chromeViolet/25 transition-all"
          />
          <kbd className="hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-softChrome/60 bg-white/[0.06] border border-softChrome/15 rounded-md pointer-events-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Action Buttons & Profile */}
      <div className="flex items-center space-x-2.5 sm:space-x-3">
        {/* Quick New Upload button */}
        <Link href="/upload" className="hidden sm:inline-flex">
          <Button size="sm" variant="outline" className="gap-1.5 text-xs font-medium border-softChrome/15 hover:border-chromeViolet/50 text-softChrome hover:text-glassBlue">
            <Upload className="h-3.5 w-3.5 text-glassBlue" />
            Upload
          </Button>
        </Link>

        {/* AI Quick Chat CTA */}
        <Link href="/chat">
          <Button size="sm" className="gap-1.5 text-xs font-medium shadow-glow-violet">
            <Sparkles className="h-3.5 w-3.5 text-mintFoam" />
            <span className="hidden sm:inline">Ask AI</span>
          </Button>
        </Link>

        {/* Notifications Popover */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative hover:bg-white/[0.08] rounded-xl text-softChrome">
              <Bell className="h-4 w-4 text-softChrome/80" />
              {unreadCount > 0 ? (
                <span className="absolute top-2 right-2 h-2 w-2 bg-chromeViolet rounded-full animate-ping" />
              ) : null}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-2 glass-panel rounded-2xl border-softChrome/15 shadow-2xl">
            <DropdownMenuLabel className="flex items-center justify-between px-3 py-2">
              <span className="font-semibold text-sm text-softChrome">Notifications</span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-chromeViolet/20 text-glassBlue border border-chromeViolet/30">
                {unreadCount} unread
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-softChrome/10 my-1" />
            {notifications.length === 0 ? (
              <div className="py-6 text-center text-xs text-softChrome/60">
                No new notifications. You're all caught up!
              </div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification._id}
                  className="flex flex-col items-start p-3 rounded-xl hover:bg-white/[0.06] cursor-pointer"
                >
                  <div className="flex items-start space-x-3 w-full">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <p className="font-medium text-xs text-softChrome">{notification.title}</p>
                      <p className="text-[11px] text-softChrome/60 mt-0.5">{notification.description}</p>
                      <p className="text-[10px] text-softChrome/40 mt-1.5">{notification.time}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator className="bg-softChrome/10 my-1" />
            <DropdownMenuItem className="text-center justify-center text-xs font-medium text-glassBlue hover:text-mintFoam cursor-pointer">
              Mark all as read
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-white/[0.08] transition-colors focus:outline-none focus:ring-2 focus:ring-chromeViolet/50 cursor-pointer">
              <div className="relative">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-toxicViolet via-chromeViolet to-hyperCobalt flex items-center justify-center text-white font-semibold text-xs shadow-glow-violet">
                  {userData.firstName ? userData.firstName[0].toUpperCase() : "U"}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-mintFoam ring-2 ring-carbonTeal-dark" />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 p-2 glass-panel rounded-2xl border-softChrome/15 shadow-2xl">
            <DropdownMenuLabel className="p-3">
              <div className="flex flex-col space-y-0.5">
                <p className="text-sm font-semibold text-softChrome">
                  {userData.firstName} {userData.lastName}
                </p>
                <p className="text-xs text-softChrome/60 truncate">{userData.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-softChrome/10 my-1" />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center px-3 py-2 text-xs rounded-xl hover:bg-white/[0.06] text-softChrome/80 hover:text-glassBlue cursor-pointer">
                <User className="mr-2.5 h-4 w-4 text-glassBlue" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/billing" className="flex items-center px-3 py-2 text-xs rounded-xl hover:bg-white/[0.06] text-softChrome/80 hover:text-glassBlue cursor-pointer">
                <CreditCard className="mr-2.5 h-4 w-4 text-mintFoam" />
                Billing & Subscription
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center px-3 py-2 text-xs rounded-xl hover:bg-white/[0.06] text-softChrome/80 hover:text-glassBlue cursor-pointer">
                <Settings className="mr-2.5 h-4 w-4 text-skinSand" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/support" className="flex items-center px-3 py-2 text-xs rounded-xl hover:bg-white/[0.06] text-softChrome/80 hover:text-glassBlue cursor-pointer">
                <HelpCircle className="mr-2.5 h-4 w-4 text-glassBlue" />
                Help & Docs
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-softChrome/10 my-1" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-xs rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-300 cursor-pointer"
            >
              <LogOut className="mr-2.5 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
