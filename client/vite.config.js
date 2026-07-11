import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-core": ["react", "react-dom", "react-router-dom"],
          "query-data": ["@tanstack/react-query", "axios"],
          "motion-ui": ["framer-motion", "lucide-react"],
          charts: ["recharts", "date-fns"],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
