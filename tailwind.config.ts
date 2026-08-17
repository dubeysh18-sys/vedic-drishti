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
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f6f3ec",
        "surface-container": "#f1eee7",
        "surface-container-high": "#ebe8e1",
        "surface-container-highest": "#e5e2db",
        "surface-stone": "#E8E5DF",
        "parchment-deep": "#E8E2D2",
        "parchment": "#F4F1EA",
        "surface": "#fcf9f2",
        "surface-bright": "#fcf9f2",
        "surface-dim": "#dcdad3",
        "surface-variant": "#e5e2db",
        "on-surface": "#1c1c18",
        "on-surface-variant": "#4b4640",
        "background": "#fcf9f2",
        "on-background": "#1c1c18",
        "primary": "#171614",
        "primary-container": "#2c2a28",
        "on-primary": "#ffffff",
        "on-primary-container": "#95918e",
        "primary-fixed": "#e7e1de",
        "primary-fixed-dim": "#cac5c2",
        "secondary": "#735c00",
        "secondary-container": "#fed65b",
        "on-secondary-container": "#745c00",
        "muted-stone": "#8C857B",
        "gold": "#D4AF37",
        "gold-muted": "#B59530",
        "gold-light": "#F5E8C7",
        "glass-fill": "rgba(255, 255, 255, 0.45)",
        "outline": "#7c766f",
        "outline-variant": "#cdc5bd",
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "2rem",
        xl: "3rem",
        full: "9999px",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
        serif: ["var(--font-literata)", "Literata", "serif"],
        display: ["var(--font-literata)", "Literata", "serif"],
        devanagari: ["var(--font-noto-devanagari)", "Noto Sans Devanagari", "serif"],
      },
      spacing: {
        "margin-mobile": "20px",
        "container-max": "1200px",
        "margin-desktop": "64px",
        "gutter": "24px",
      },
      boxShadow: {
        soft: "0 8px 24px rgba(44, 42, 40, 0.04)",
        modern: "0 10px 30px -10px rgba(0, 0, 0, 0.08), 0 4px 10px -5px rgba(0, 0, 0, 0.04)",
        glass: "0 4px 30px rgba(212, 175, 55, 0.08)",
      },
      animation: {
        "pulse-gold": "pulseGold 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        pulseGold: {
          "0%, 100%": {
            transform: "scale(1)",
            filter: "drop-shadow(0 0 8px rgba(212, 175, 55, 0.3))",
            opacity: "0.9",
          },
          "50%": {
            transform: "scale(1.04)",
            filter: "drop-shadow(0 0 18px rgba(212, 175, 55, 0.7))",
            opacity: "1",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
