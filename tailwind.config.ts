import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // User's custom signature palette
        chromeViolet: {
          DEFAULT: "#5F2CFF",
          light: "#7B4FFF",
          dark: "#4B1ECC",
        },
        glassBlue: {
          DEFAULT: "#DFF6FF",
          subtle: "rgba(223, 246, 255, 0.12)",
        },
        carbonTeal: {
          DEFAULT: "#042F32",
          dark: "#021A1C",
          surface: "#073B3F",
          light: "#0B4C51",
        },
        mintFoam: {
          DEFAULT: "#D6FFCB",
          glow: "rgba(214, 255, 203, 0.25)",
        },
        hyperCobalt: {
          DEFAULT: "#0038FF",
          glow: "rgba(0, 56, 255, 0.35)",
        },
        skinSand: {
          DEFAULT: "#FFD8B8",
          glow: "rgba(255, 216, 184, 0.2)",
        },
        toxicViolet: {
          DEFAULT: "#3D007A",
          dark: "#25004D",
          surface: "#4D0596",
        },
        softChrome: {
          DEFAULT: "#E8ECF1",
          muted: "rgba(232, 236, 241, 0.65)",
        },

        // Semantic bindings for Shadcn / UI components
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        "3xl": "1.5rem",
        "2xl": "1.25rem",
        xl: "1rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      boxShadow: {
        "glow-violet": "0 0 25px -4px rgba(95, 44, 255, 0.45)",
        "glow-cobalt": "0 0 30px -4px rgba(0, 56, 255, 0.45)",
        "glow-mint": "0 0 20px -3px rgba(214, 255, 203, 0.3)",
        "glow-sand": "0 0 20px -3px rgba(255, 216, 184, 0.25)",
        "glow-sm": "0 0 15px -3px rgba(95, 44, 255, 0.3)",
        "glow-md": "0 0 30px -4px rgba(95, 44, 255, 0.45)",
        "glow-lg": "0 0 50px -5px rgba(95, 44, 255, 0.55)",
        "inner-glow": "inset 0 1px 1px 0 rgba(223, 246, 255, 0.15)",
        "card": "0 10px 30px -10px rgba(2, 26, 28, 0.8)",
        "card-hover": "0 20px 40px -15px rgba(95, 44, 255, 0.35)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2.5s infinite linear",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 3s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        glow: {
          "0%": { opacity: "0.4", filter: "blur(20px)" },
          "100%": { opacity: "0.85", filter: "blur(32px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
