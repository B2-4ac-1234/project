import { defineConfig } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
/**
 * 自动导入ref等函数的插件
 */
import autoImport from "unplugin-auto-import/vite";
import tailwindcss from "tailwindcss";
/**
 * vite.config.ts修改自动重启插件
 */
import viteRestart from "vite-plugin-restart";
/**
 * 增强输出控制台日志插件
 */
import TurboConsole from "unplugin-turbo-console/vite";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    autoImport({
      dts: "./src/auto-import.d.ts",
      imports: ["vue"],
    }),
    viteRestart({
      restart: ["vite.config.[jt]s"],
    }),
    TurboConsole({
      /* options here */
      prefix: `${new Date().toLocaleString()}`,
      disableLaunchEditor: true,
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
  server: { host: "0.0.0.0", port: 8080 },
  clearScreen: false,
});
