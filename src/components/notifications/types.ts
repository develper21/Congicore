export type NotificationType = "success" | "error" | "warning" | "info" | "document" | "chat" | "memory" | "system"

export type NotificationTheme = "default" | "minimal" | "colorful" | "glass" | "neon" | "retro"

export interface Notification {
  id: string
  title: string
  message?: string
  type: NotificationType
  duration?: number // 0 for persistent
  action?: {
    label: string
    onClick: () => void
  }
  icon?: React.ReactNode
  timestamp: Date
}
