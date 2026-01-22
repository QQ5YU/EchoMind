import { ipcMain } from "electron";
import { INestApplicationContext } from "@nestjs/common";
import { IpcDispatcher } from "./dispatcher";
import { IpcRequest } from "./types";
import { APP_CONTROLLERS } from "../backend/constants";
import {
  ExceptionResponseAdapter,
  ErrorLoggerService,
} from "@backend/core/error-handling";

export function setupApiHandlers(nestApp: INestApplicationContext) {
  const dispatcher = new IpcDispatcher(nestApp);

  const exceptionAdapter = nestApp.get(ExceptionResponseAdapter);
  const loggerService = nestApp.get(ErrorLoggerService);

  dispatcher.registerControllers(APP_CONTROLLERS);

  ipcMain.handle("api-request", async (_event, config: IpcRequest) => {
    try {
      const result = await dispatcher.dispatch(config);
      return { data: result, status: 200 };
    } catch (error: unknown) {
      const err = error as Error | { stack?: string };
      const { status, body } = exceptionAdapter.toApiResponse(err, {
        path: (config && config.url) || "ipc",
        method: (config && config.method) || "IPC",
      });

      loggerService.log(status, {
        method: (config && config.method) || "IPC",
        path: (config && config.url) || "ipc",
        message: body?.message || err?.message || String(err),
        stack: err.stack,
      });

      return {
        error: true,
        status,
        data: body,
      };
    }
  });
}
