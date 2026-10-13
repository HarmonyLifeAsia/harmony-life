import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Front: ./web -> ./dist (serwowane przez Workers Static Assets).
export default defineConfig({
  root: "web",
  plugins: [react()],
  build: { outDir: "../dist", emptyOutDir: true, sourcemap: false, target: "es2022" },
  worker: { format: "es" },
  server: {
    port: 5173,
    // Dev: API działa w `wrangler dev` (8787).
    proxy: { "/api": "http://localhost:8787" },
  },
});
