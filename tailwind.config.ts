import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#FAF7F0",
        cream: "#F4EEE2",
        sand: "#EBE1CF",
        champagne: {
          DEFAULT: "#BFA06A",
          light: "#D8C39A",
          deep: "#A9884E",
        },
        sage: {
          DEFAULT: "#A6B29B",
          light: "#CBD3C1",
          deep: "#7C8A6E",
        },
        graphite: {
          DEFAULT: "#2A2A26",
          soft: "#4A4A44",
          muted: "#6E6D64",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        eyebrow: "0.22em",
      },
      maxWidth: {
        content: "1200px",
      },
      boxShadow: {
        soft: "0 20px 60px -30px rgba(80, 66, 40, 0.25)",
        card: "0 24px 70px -40px rgba(80, 66, 40, 0.35)",
        glow: "0 0 80px -10px rgba(191, 160, 106, 0.35)",
      },
      backgroundImage: {
        "gold-line":
          "linear-gradient(90deg, transparent, rgba(191,160,106,0.6), transparent)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-24px) translateX(12px)" },
        },
        "float-slower": {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(20px) translateX(-16px)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.05)" },
        },
      },
      animation: {
        "float-slow": "float-slow 14s ease-in-out infinite",
        "float-slower": "float-slower 18s ease-in-out infinite",
        "spin-slow": "spin-slow 60s linear infinite",
        "pulse-glow": "pulse-glow 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
