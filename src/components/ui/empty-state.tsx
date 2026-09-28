import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center relative overflow-hidden rounded-2xl border border-softChrome/10 bg-carbonTeal/40 backdrop-blur-md">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-chromeViolet/15 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Icon Orb */}
      <div className="relative mb-5">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-toxicViolet/30 via-chromeViolet/20 to-hyperCobalt/20 border border-chromeViolet/35 flex items-center justify-center shadow-glow-violet">
          <Icon className="h-8 w-8 text-glassBlue" />
        </div>
        <div className="absolute -inset-1 rounded-2xl border border-chromeViolet/20 animate-pulse pointer-events-none" />
      </div>

      <h3 className="text-xl font-semibold mb-2 text-softChrome">{title}</h3>
      <p className="text-sm text-softChrome/60 mb-6 max-w-sm leading-relaxed">{description}</p>
      
      {action && (
        <Button onClick={action.onClick} className="px-6 py-2.5 shadow-glow-violet">
          {action.label}
        </Button>
      )}
    </div>
  );
}
