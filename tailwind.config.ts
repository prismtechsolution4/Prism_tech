import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        "bg-elevated": "var(--color-bg-elevated)",
        surface: "var(--color-surface)",
        border: "var(--color-border)",
        "border-subtle": "var(--color-border-subtle)",
        "border-hover": "var(--color-border-hover)",
        text: "var(--color-text)",
        muted: "var(--color-text-muted)",
        brand: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          80: "var(--color-primary-80)",
          70: "var(--color-primary-70)",
          60: "var(--color-primary-60)",
          50: "var(--color-primary-50)",
          35: "var(--color-primary-35)",
          20: "var(--color-primary-20)",
          16: "var(--color-primary-16)",
        },
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
        },
        accent: "var(--color-accent)",
        cyan: "var(--color-accent)",
        emerald: "var(--color-emerald)",
        obsidian: "var(--color-bg)",
        glow: "var(--color-glow)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"],
        mono: ["var(--font-mono)"],
      },
      borderRadius: {
        card: "var(--radius-card)",
        btn: "var(--radius-btn)",
        input: "var(--radius-input)",
        thumb: "var(--radius-thumb)",
      },
      boxShadow: {
        glow: "var(--shadow-glow)",
        card: "var(--shadow-card)",
        popup: "var(--shadow-popup)",
      },
      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-timeline": "var(--gradient-timeline)",
        "gradient-divider": "var(--gradient-divider)",
        "gradient-panel": "var(--gradient-panel)",
        "gradient-scrim": "var(--gradient-scrim)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "ping-soft": {
          "0%": { boxShadow: "0 0 0 0 var(--color-glow)" },
          "100%": { boxShadow: "0 0 0 18px transparent" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.6s ease-out forwards",
        marquee: "marquee 38s linear infinite",
        "ping-soft": "ping-soft 2.2s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
