import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Base ──────────────────────────
        background: "#F9F9F7",
        foreground: "#1A1A1A",

        // ── Marque (boutons CTA, liens) ──
        primary: {
          DEFAULT: "#CCA43B",
          foreground: "#FFFFFF",
          light: "#E0C36A",
          dark: "#B08A2A",
        },

        // ── Secondaire (badges, tags) ────
        secondary: {
          DEFAULT: "#F0EDE5",
          foreground: "#5C5540",
        },

        // ── Atténué (placeholders, sections) ──
        muted: {
          DEFAULT: "#F0EDE5",
          foreground: "#8A8578",
        },

        // ── Erreur / danger ──────────────
        destructive: {
          DEFAULT: "#DC2626",
          foreground: "#FFFFFF",
        },

        // ── Succès ───────────────────────
        success: {
          DEFAULT: "#16A34A",
          foreground: "#FFFFFF",
        },

        // ── Utilitaires ──────────────────
        border: "#E5E2DA",
        input: "#E5E2DA",
        ring: "#CCA43B",
        card: {
          DEFAULT: "#FEFDFB",
          foreground: "#1A1A1A",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
        display: ["var(--font-playfair)", ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [typography],
};

export default config;
