import type { Config } from "tailwindcss";

const colors = {
  obsidian: "#0B0C10",
  "wood-espresso": "#2B1D14",
  "gold-champagne": "#C8A24A",
  "red-crimson": "#B11226",
  ink: "#111318",
  bone: "#F4F1EA",
  slate: "#2A2E36",
  success: "#1F8A70",
  warning: "#F2B705",
  danger: "#D62828",
};

const config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors,
      fontFamily: {
        display: [
          "var(--font-oswald)",
          "var(--font-bebas)",
          "Oswald",
          "Bebas Neue",
          "sans-serif",
        ],
        body: [
          "var(--font-inter)",
          "var(--font-source-sans)",
          "Inter",
          "Source Sans 3",
          "sans-serif",
        ],
      },
    },
  },
} satisfies Config;

export default config;

