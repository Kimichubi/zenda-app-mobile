/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4f46e5",
          foreground: "#f8fafc",
        },
        background: "#ffffff",
        foreground: "#020817",
        muted: {
          DEFAULT: "#f1f5f9",
          foreground: "#64748b",
        },
        accent: {
          DEFAULT: "#f1f5f9",
          foreground: "#0f172a",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#020817",
        },
        border: "#e2e8f0",
        destructive: "#ef4444",
        success: "#10b981",
        warning: "#f59e0b",
      }
    },
  },
  plugins: [],
};
