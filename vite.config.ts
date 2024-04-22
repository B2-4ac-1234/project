import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  publicDir: "public",
  base: "/project/",
  build: {
    outDir: "docs",
  },
  server: {
    host: "192.168.99.102",
    port: 8888,
  },
});
