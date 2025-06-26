import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: mode === 'development' ? 'http://127.0.0.1:8000' : process.env.BACKEND_URL || 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: mode !== "production",
    target: "es2020", // ✅ FIX: Update from "es2015" to "es2020" to support BigInt
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom")) {
              return "react-vendor";
            }
            if (id.includes("leaflet")) {
              return "leaflet";
            }
            if (id.includes("lucide-react") || id.includes("@radix-ui")) {
              return "ui-vendor";
            }
            return "vendor";
          }

          if (id.includes("/components/ui/")) {
            return "ui-components";
          }

          return undefined;
        },
      },
    },
  },
}));
