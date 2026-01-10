import axios, { AxiosInstance, AxiosAdapter } from "axios";
import type { INotificationService } from "@renderer/shared/types/interface";
import { ToastSeverity } from "@shared/enum/enum";
import { ApiError } from "./types";

/**
 * Creates a pre-configured Axios instance.
 * The adapter can be optionally provided to support different communication layers (e.g., IPC or HTTP).
 */
export const createApiClient = (
  notification: INotificationService,
  getToken: () => string | null,
  onUnauthorized: () => void,
  adapter?: AxiosAdapter
): AxiosInstance => {
  const api = axios.create({
    adapter,
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (axios.isAxiosError<ApiError>(error)) {
        if (error.code === "ERR_NETWORK") {
          notification.show(
            ToastSeverity.ERROR,
            "Unable to connect to the server. Please check your connection."
          );
          return Promise.reject(error);
        }

        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;

        switch (status) {
          case 401:
            if (error.config && error.config.url !== "/api/auth/login") {
              notification.show(
                ToastSeverity.ERROR,
                "Session expired. Please log in again."
              );
              onUnauthorized();
            }
            break;
          case 500:
            notification.show(ToastSeverity.ERROR, message);
            console.error("Server Error:", message);
            break;
          default:
            console.log("API Error:", error);
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};
