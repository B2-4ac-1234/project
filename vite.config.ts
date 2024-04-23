import { defineConfig } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
/**
 * 自动导入ref等函数的插件
 */
import autoImport from "unplugin-auto-import/vite";
import tailwindcss from "tailwindcss";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    autoImport({
      dts: "./src/auto-import.d.ts",
      imports: ["vue"],
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  publicDir: "public",
  base: "/project/",
  build: {
    outDir: "docs",
    sourcemap: false,
  },
  server: {
    port: 8888,
  },
});
