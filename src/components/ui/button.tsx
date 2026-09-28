import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-chromeViolet via-[#5022E6] to-hyperCobalt text-white shadow-glow-violet hover:brightness-110 border border-glassBlue/25 hover:shadow-glow-lg",
        destructive:
          "bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-sm hover:brightness-110 border border-red-500/30",
        outline:
          "border border-softChrome/15 bg-carbonTeal/40 backdrop-blur-md hover:bg-carbonTeal/70 hover:border-chromeViolet/50 text-softChrome hover:text-glassBlue shadow-sm",
        secondary:
          "bg-toxicViolet/80 hover:bg-toxicViolet text-glassBlue border border-softChrome/10 hover:border-glassBlue/25 shadow-sm",
        ghost:
          "hover:bg-white/[0.07] hover:text-glassBlue text-softChrome/80 transition-colors",
        link:
          "text-chromeViolet underline-offset-4 hover:underline hover:text-glassBlue p-0 h-auto active:scale-100",
        glow:
          "bg-gradient-to-r from-chromeViolet via-hyperCobalt to-toxicViolet text-white shadow-glow-violet hover:shadow-glow-lg border border-glassBlue/30 hover:scale-[1.02] font-semibold",
        mint:
          "bg-mintFoam/15 text-mintFoam border border-mintFoam/30 hover:bg-mintFoam/25 hover:border-mintFoam/50 shadow-glow-mint",
        sand:
          "bg-skinSand/15 text-skinSand border border-skinSand/30 hover:bg-skinSand/25 hover:border-skinSand/50 shadow-glow-sand",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-7 text-base",
        icon: "h-10 w-10 p-0 flex items-center justify-center",
        "icon-sm": "h-8 w-8 p-0 rounded-lg flex items-center justify-center",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
