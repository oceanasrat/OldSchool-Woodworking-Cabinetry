/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Light, warm theme commonly used for artisan portfolios
        background: "#FAFAF7",       // warm off-white
        foreground: "#111827",       // slate-900
        muted: "#FFFFFF",            // cards/surfaces
        "muted-foreground": "#6B7280", // slate-500
        primary: "#F59E0B",          // amber-500 for CTAs
        border: "#E5E7EB"            // slate-200
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        soft: "0 10px 30px rgba(17,24,39,0.06)" // subtle elevation
      }
    },
  },
  plugins: [],
}

