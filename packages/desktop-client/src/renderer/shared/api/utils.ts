import { isAxiosError } from "axios";
import { ApiError } from "./types";
import { toastService } from "@shared/services";
import { ToastSeverity } from "@renderer/shared/enum/enum";

export const handleApiError = (
  error: unknown,
  defaultMessage: string,
): string => {
  let message = defaultMessage;

  if (isAxiosError<ApiError>(error)) {
    if (error.response?.data?.message) {
      const msg = error.response.data.message;
      message = Array.isArray(msg) ? msg.join(", ") : msg;
    } else if (error.message) {
      message = error.message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  console.error(defaultMessage, error);
  toastService.show(ToastSeverity.ERROR, `${defaultMessage}: ${message}`);

  return message;
};
