import react from "@vitejs/plugin-react";
import path from 'path';
import { defineConfig } from "vite"
import { fileURLToPath } from "url";
import tailwindcss from "tailwindcss";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
