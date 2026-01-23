import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import type { IpcApi } from "@renderer/shared/types";
import { logger } from "./logger";

const api: IpcApi = {
  invoke: (channel: string, data?: unknown) =>
    ipcRenderer.invoke(channel, data),
  send: (channel: string, data?: unknown) => ipcRenderer.send(channel, data),
  on: (channel: string, callback: (...args: unknown[]) => void) => {
    ipcRenderer.on(channel, (_event, ...args) => callback(...args));
  },
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    logger.error(error);
  }
} else {
  window.electron = electronAPI;
  window.api = api;
}
