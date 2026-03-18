import type { Config } from "tailwindcss";

const colors = {
  obsidian: "#050505",
  "racing-red": "#FF0000",
  "neon-red": "#FF3131",
  "chrome": "#E2E8F0",
  "steel-dark": "#1A1A1B",
  "steel-light": "#4A4A48",
  "carbon": "#111111",
  ink: "#0A0A0A",
  white: "#FFFFFF",
  success: "#00FF41",
  warning: "#FFD700",
  danger: "#FF0000",
};

const config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors,
      backgroundImage: {
        'carbon-pattern': "radial-gradient(circle, #1a1a1a 0%, #0a0a0a 100%)",
        'steel-gradient': "linear-gradient(180deg, #4A4A48 0%, #1A1A1B 100%)",
      },
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
          "Inter",
          "sans-serif",
        ],
        racing: [
          "var(--font-racing)",
          "Racing Sans One",
          "sans-serif",
        ],
      },
      boxShadow: {
        'neon-red': '0 0 10px rgba(255, 49, 49, 0.5), 0 0 20px rgba(255, 49, 49, 0.3)',
        'chrome': '0 0 15px rgba(226, 232, 240, 0.2)',
      }
    },
  },
} satisfies Config;

export default config;

