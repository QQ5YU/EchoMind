import { useState, useCallback } from "react";
import { isAxiosError } from "axios";
import { ApiErrorResponse } from "@renderer/shared/api/types";
import { useAuthStore } from "@entities/user/model/store";
import { userApi } from "@entities/user/api/userApi";
import { RegisterFormData } from "../ui/RegisterForm";

export const useRegister = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof RegisterFormData, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);

  const register = useCallback(
    async (credentials: RegisterFormData): Promise<boolean> => {
      setError(null);
      setFieldErrors({});
      setIsLoading(true);

      try {
        const { data } = await userApi.register(credentials);

        if (data?.user && data?.access_token) {
          setAuth(data.user, data.access_token);
          return true;
        } else {
          throw new Error("Invalid server response");
        }
      } catch (err) {
        if (isAxiosError<ApiErrorResponse>(err)) {
          if (err.response) {
            const { status, data } = err.response;
            if (status === 409) {
              setFieldErrors({
                email: "Email already exists. Please use another one.",
              });
            } else {
              const message = Array.isArray(data?.message)
                ? data.message.join(", ")
                : data?.message;
              setError(message || "Registration failed. Please try again.");
            }
            return false;
          }
        }

        setError("An unexpected error occurred. Please try again.");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [setAuth],
  );

  return { register, error, fieldErrors, isLoading };
};
