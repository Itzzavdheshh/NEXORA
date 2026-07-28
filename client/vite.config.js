import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false, // no source maps in production — saves ~30% on bundle payload
    chunkSizeWarningLimit: 600, // recharts + framer-motion are intentionally large
    rollupOptions: {
      output: {
        manualChunks: {
          "react-core":  ["react", "react-dom", "react-router-dom"],
          "query-data":  ["@tanstack/react-query", "axios"],
          "motion-ui":   ["framer-motion", "lucide-react"],
          "charts":      ["recharts", "date-fns"],
          "supabase":    ["@supabase/supabase-js"],   // isolated — large, stable cache
          "forms":       ["react-hook-form", "zod"],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
