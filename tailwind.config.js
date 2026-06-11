/** @type {import('tailwindcss').Config} */
// Warna & font di-sourcing dari objek token `C` prototype (lib/tokens.js).
// Sumber kebenaran visual = prototype, bukan angka di CLAUDE.md.
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#03346E",
        yellow: "#FBDA7B",
        "yellow-dk": "#C8911C",
        astral: "#3674B5",
        bg: "#F8F9FB",
        text: "#0F172A",
        "text-md": "#475569",
        "text-sm": "#5B6573",
        border: "#E2E8F0",
        "border-lt": "#F1F5F9",
        ok: "#059669",
        "ok-bg": "#ECFDF5",
        err: "#DC2626",
        "err-bg": "#FEF2F2",
        warn: "#B45309",
        "warn-bg": "#FEF3C7",
      },
      fontFamily: {
        heading: ["var(--font-urbanist)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
