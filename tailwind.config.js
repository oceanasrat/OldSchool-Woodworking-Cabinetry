/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#FAF7F2",   // cream
        foreground: "#1F2937",   // charcoal
        surface: "#FFFFFF",      // card
        border: "#E5E7EB",
        primary: "#B66A2A",      // copper
        primaryHover: "#95531F",
        brand: "#1F5C3E",        // deep green (logo)
        muted: "#6B7280"
      },
      fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui"] },
      borderRadius: { xl: "1rem", "2xl": "1.25rem" },
      boxShadow: { soft: "0 10px 30px rgba(17,24,39,0.06)" }
    }
  },
  plugins: [],
}
