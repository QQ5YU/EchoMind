import { AxiosAdapter, AxiosError, AxiosResponse } from "axios";
import type { ApiRequest, ApiResponse } from "../types";

/**
 * Custom Axios Adapter that routes requests through Electron IPC.
 * This allows the renderer process to communicate with the embedded NestJS backend.
 */
export const ipcAdapter: AxiosAdapter = async (config) => {
  if (!window.api) {
    throw new Error("IPC API is not available on window object");
  }

  try {
    const requestPayload: ApiRequest = {
      method: config.method,
      url: config.url ?? "",
      data: config.data,
      params: config.params,
      headers: config.headers ?? {},
    };

    const response = await window.api.invoke<ApiRequest, ApiResponse<unknown>>(
      "api-request",
      requestPayload,
    );

    if ("error" in response && response.error === true) {
      throw new AxiosError(
        response.data.message || "Request failed",
        String(response.status),
        config,
        undefined,
        {
          data: response.data,
          status: response.status,
          statusText: response.statusText ?? "Error",
          headers: response.headers ?? {},
          config,
        },
      );
    }

    const axiosResponse: AxiosResponse = {
      data: response.data,
      status: response.status,
      statusText: response.statusText ?? "OK",
      headers: response.headers ?? {},
      config,
    };

    return axiosResponse;
  } catch (error) {
    return Promise.reject(error);
  }
};
