import { defineConfig } from "electron-vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  main: {
    resolve: {
      alias: {
        "@renderer": resolve(__dirname, "src/renderer"),
        "@app": resolve(__dirname, "src/renderer/app"),
        "@pages": resolve(__dirname, "src/renderer/pages"),
        "@features": resolve(__dirname, "src/renderer/features"),
        "@entities": resolve(__dirname, "src/renderer/entities"),
        "@widgets": resolve(__dirname, "src/renderer/widgets"),
        "@shared": resolve(__dirname, "src/renderer/shared"),
        "@shared-core": resolve(__dirname, "src/shared"),
        "@backend": resolve(__dirname, "../backend/src"),
        "@echomind/shared": resolve(__dirname, "../shared/src/index.ts"),
      },
    },
    build: {
      rollupOptions: {
        external: [
          "nestjs-zod",
          "clone-deep",
          "multer",
          "@prisma/client",
          "dotenv/config",
          "dotenv",
        ],
      },
      externalizeDeps: {},
    },
  },
  preload: {
    resolve: {
      alias: {
        "@renderer": resolve(__dirname, "src/renderer"),
        "@app": resolve(__dirname, "src/renderer/app"),
        "@pages": resolve(__dirname, "src/renderer/pages"),
        "@features": resolve(__dirname, "src/renderer/features"),
        "@entities": resolve(__dirname, "src/renderer/entities"),
        "@widgets": resolve(__dirname, "src/renderer/widgets"),
        "@shared": resolve(__dirname, "src/renderer/shared"),
        "@shared-core": resolve(__dirname, "src/shared"),
        "@backend": resolve(__dirname, "../backend/src"),
        "@echomind/shared": resolve(__dirname, "../shared/src/index.ts"),
      },
    },
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
        "@renderer": resolve(__dirname, "src/renderer"),
        "@app": resolve(__dirname, "src/renderer/app"),
        "@pages": resolve(__dirname, "src/renderer/pages"),
        "@features": resolve(__dirname, "src/renderer/features"),
        "@entities": resolve(__dirname, "src/renderer/entities"),
        "@widgets": resolve(__dirname, "src/renderer/widgets"),
        "@shared": resolve(__dirname, "src/renderer/shared"),
        "@shared-core": resolve(__dirname, "src/shared"),
        "@backend": resolve("../backend/src"),
        "@echomind/shared": resolve("../shared/src/index.ts"),
      },
    },
    optimizeDeps: {
      include: ["@echomind/shared"],
    },
    plugins: [react()],
  },
});
