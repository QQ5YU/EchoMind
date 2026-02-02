import {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

import { ApiErrorResponse } from "../types";
import { logger } from "@renderer/shared/utils/logger";
import { INotificationService } from "@renderer/shared/utils";
import { ToastSeverity } from "@renderer/shared/config";

type GetTokenFn = () => string | null;
type OnUnauthorizedFn = () => void;

export const setupRequestInterceptor = (
  api: AxiosInstance,
  getToken: GetTokenFn,
) => {
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getToken();
      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
      return config;
    },
    (error) => Promise.reject(error),
  );
};

export const setupResponseInterceptor = (
  api: AxiosInstance,
  notification: INotificationService,
  onUnauthorized: OnUnauthorizedFn,
) => {
  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: unknown) => {
      let errorTimeout = null;

      if (!isAxiosError(error)) {
        return Promise.reject(error);
      }

      const axiosError = error as AxiosError<ApiErrorResponse>;

      if (axiosError.code === "ERR_NETWORK") {
        notification.show(
          ToastSeverity.ERROR,
          "Unable to connect to the server. Please check your connection.",
        );
        return Promise.reject(axiosError);
      }

      const status = axiosError.response?.status;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Unknown error";

      const displayMessage = Array.isArray(message)
        ? message.join(", ")
        : message;

      switch (status) {
        case 401:
          if (
            axiosError.config &&
            !axiosError.config.url?.includes("/auth/login")
          ) {
            if (!errorTimeout) {
              notification.show(
                ToastSeverity.ERROR,
                "Session expired. Please log in again.",
              );
              onUnauthorized();

              errorTimeout = setTimeout(() => {
                errorTimeout = null
              }, 500);
            }
          }
          break;

        case 500:
          notification.show(
            ToastSeverity.ERROR,
            `Server Error: ${displayMessage}`,
          );
          logger.error("Server Error:", displayMessage);
          break;

        default:
          logger.debug("API Error:", axiosError);
      }

      return Promise.reject(axiosError);
    },
  );
};

function isAxiosError(payload: any): payload is AxiosError {
  return payload?.isAxiosError === true;
}
