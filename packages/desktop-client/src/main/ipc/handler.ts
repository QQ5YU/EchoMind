import { ipcMain } from "electron";
import { INestApplicationContext } from "@nestjs/common";
import { IpcDispatcher } from "./dispatcher";
import { APP_CONTROLLERS } from "../backend/constants";

/**
 * Sets up all IPC API listeners
 */
export function setupApiHandlers(nestApp: INestApplicationContext) {
  const dispatcher = new IpcDispatcher(nestApp);

  dispatcher.registerControllers(APP_CONTROLLERS);

  ipcMain.handle("api-request", async (_event, config: any) => {
    try {
      const result = await dispatcher.dispatch(config);
      return { data: result, status: 200 };
    } catch (error: any) {
      console.error(
        `[IPC Error] ${config.method} ${config.url}:`,
        error.message
      );
      const status =
        error.status || (error.message.includes("not found") ? 404 : 500);

      return {
        error: true,
        status,
        data: error.message || "Internal Server Error",
      };
    }
  });
}
