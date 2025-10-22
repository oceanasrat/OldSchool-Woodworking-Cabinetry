/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Palette chosen for layered readability (no color "covering" on overlap)
        background: "#FAFAF7",      // warm paper
        foreground: "#111827",      // slate-900
        surface: "#FFFFFF",         // cards
        muted: "#6B7280",           // slate-500 text
        border: "#E5E7EB",          // slate-200 lines
        primary: "#D97706",         // amber-600 (accessible on white)
        primaryHover: "#B45309"     // amber-700
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"]
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(17,24,39,0.06)"
      }
    }
  },
  plugins: []
}
