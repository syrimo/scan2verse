import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: true,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Optimize dependencies for better hot reload and prevent initialization issues
  optimizeDeps: {
    include: ['react', 'react-dom', 'recharts'],
  },
  // Clear cache on restart in development
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            // Specific large libraries get their own chunks
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            // Everything else goes into vendor-react to guarantee React availability
            return 'vendor-react';
          }
          
          // Core chunks
          if (id.includes('src/components/ui')) {
            return 'core-ui';
          }
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
}));
