import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // base: '/signcms_new_node/',
  base: mode === 'production' ? '/signcms_new_node/' : '/',
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/backend/uploads': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      // 將 /signcms_api_dev 轉發到後端伺服器
      '/signcms_api_dev': {
        target: 'https://signcms.net',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
