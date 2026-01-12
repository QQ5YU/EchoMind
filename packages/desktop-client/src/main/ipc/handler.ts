import { ipcMain } from "electron";
import { INestApplicationContext } from "@nestjs/common";
import { IpcDispatcher } from "./dispatcher";
import { APP_CONTROLLERS } from "../backend/constants";
import { ExceptionResponseAdapter } from "../../../../backend/src/core/error-handling/adapters";
import { ErrorLoggerService } from "../../../../backend/src/core/error-handling/logger";

/**
 * Sets up all IPC API listeners
 */
export function setupApiHandlers(nestApp: INestApplicationContext) {
  const dispatcher = new IpcDispatcher(nestApp);

  const exceptionAdapter = nestApp.get(ExceptionResponseAdapter);
  const loggerService = nestApp.get(ErrorLoggerService);

  dispatcher.registerControllers(APP_CONTROLLERS);

  ipcMain.handle("api-request", async (_event, config: any) => {
    try {
      const result = await dispatcher.dispatch(config);
      return { data: result, status: 200 };
    } catch (error: any) {
      const { status, body } = exceptionAdapter.toApiResponse(error, {
        path: config.url || "ipc",
        method: config.method || "IPC",
      });

      loggerService.log(status, {
        method: config.method || "IPC",
        path: config.url || "ipc",
        message: body.message,
        stack: error.stack,
      });

      return {
        error: true,
        status,
        data: body,
      };
    }
  });
}
