import { defineConfig } from "electron-vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  main: {
    resolve: {
      alias: {
        "@backend": resolve("../backend/src"),
        "@echomind/shared": resolve("../shared/src/index.ts"),
      },
    },
    build: {
      rollupOptions: {
        external: ["nestjs-zod", "clone-deep", "multer", "@prisma/client"],
      },
      externalizeDeps: {},
    },
  },
  preload: {
    build: {
      externalizeDeps: {},
    },
  },
  renderer: {
    root: "src/renderer",
    base: "/",
    server: {
      host: "0.0.0.0",
      port: 5173,
    },
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer"),
        "@app": resolve("src/renderer/app"),
        "@pages": resolve("src/renderer/pages"),
        "@widgets": resolve("src/renderer/widgets"),
        "@features": resolve("src/renderer/features"),
        "@entities": resolve("src/renderer/entities"),
        "@shared": resolve("src/renderer/shared"),
        "@echomind/shared": resolve("../shared/src/index.ts"),
      },
    },
    optimizeDeps: {
      include: ["@echomind/shared"],
    },
    plugins: [react()],
  },
});
