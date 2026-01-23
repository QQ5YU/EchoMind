import { isAxiosError } from "axios";
import { ApiErrorResponse } from "../types";

export const getErrorMessage = (
  error: unknown,
  defaultMessage: string = "An unexpected error occurred",
): string => {
  if (isAxiosError<ApiErrorResponse>(error)) {
    const responseData = error.response?.data;

    if (responseData) {
      if (typeof responseData.message === "string") {
        return responseData.message;
      }
      if (Array.isArray(responseData.message)) {
        return responseData.message.join(", ");
      }
    }

    if (error.message) {
      return error.message;
    }
  } else if (error instanceof Error) {
    return error.message;
  }

  return defaultMessage;
};
