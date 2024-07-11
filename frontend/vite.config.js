import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import clean from 'vite-plugin-clean';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 3000,
    proxy: {
      "/admin": {
        target: "http://admin.localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/admin/, ""),
      },
    },
  },
  plugins: [clean(),react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'] // Adjust based on your dependencies
        }
      }
    }
  }
});
