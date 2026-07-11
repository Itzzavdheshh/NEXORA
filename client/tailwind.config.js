import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f8fafc",
          100: "#eef2f7",
          200: "#d9e1ec",
          400: "#8290a6",
          500: "#61708a",
          700: "#273247",
          900: "#101624",
          950: "#080b13",
        },
        brand: {
          50: "#eef7ff",
          100: "#d9edff",
          300: "#82c8ff",
          500: "#1b91ff",
          600: "#0874df",
          700: "#075db4",
        },
        mint: {
          100: "#dcfce7",
          400: "#4ade80",
          500: "#22c55e",
        },
        amber: {
          100: "#fef3c7",
          400: "#fbbf24",
          500: "#f59e0b",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      boxShadow: {
        glow: "0 24px 80px rgba(27, 145, 255, 0.22)",
        panel: "0 18px 60px rgba(8, 11, 19, 0.10)",
      },
      backgroundImage: {
        "premium-radial":
          "radial-gradient(circle at top left, rgba(27,145,255,.18), transparent 30%), radial-gradient(circle at bottom right, rgba(34,197,94,.12), transparent 28%)",
      },
    },
  },
  plugins: [forms],
};
