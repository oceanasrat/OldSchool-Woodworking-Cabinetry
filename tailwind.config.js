/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        foreground: "#f6f6f6",
        muted: "#111114",
        'muted-foreground': "#a3a3a3",
        primary: "#eab308",
        secondary: "#1f2937"
      },
      borderRadius: {
        xl: "1rem",
        '2xl': "1.25rem"
      }
    },
  },
  plugins: [],
}
