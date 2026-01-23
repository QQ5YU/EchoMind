import "reflect-metadata";
import { app, shell, BrowserWindow } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import { BackendManager } from "./backend/manager";
import { setupApiHandlers } from "./ipc/handler";
import { logger } from "./logger";

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux"
      ? { icon: join(__dirname, "../../resources/icon.png") }
      : {}),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  mainWindow.on("ready-to-show", () => mainWindow.show());

  mainWindow.webContents.setWindowOpenHandler((details) => {
    const url = details.url;
    logger.debug(`Window open request: ${url}`);

    if (url.startsWith("http:") || url.startsWith("https:")) {
      if (
        process.env["ELECTRON_RENDERER_URL"] &&
        url.startsWith(process.env["ELECTRON_RENDERER_URL"])
      ) {
        return { action: "allow" };
      }

      logger.debug(`Opening external link: ${url}`);
      shell.openExternal(url);
    }

    return { action: "deny" };
  });

  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId("com.echomind");

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  try {
    const backend = BackendManager.getInstance();
    const context = await backend.initialize();
    setupApiHandlers(context);
  } catch (error) {
    logger.error("Failed to start EchoMind Backend:", error);
  }

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
