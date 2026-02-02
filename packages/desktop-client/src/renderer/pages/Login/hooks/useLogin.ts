import { useState, useCallback } from "react";
import { isAxiosError } from "axios";
import { ApiErrorResponse } from "@renderer/shared/api/types";
import { useAuthStore } from "@entities/user/model/store";
import { userApi } from "@entities/user/api/userApi";
import { LoginFormData } from "../ui/LoginForm";

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(
    async (credentials: LoginFormData): Promise<boolean> => {
      setError(null);
      setIsLoading(true);

      try {
        const { data } = await userApi.login(credentials);

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
            if (status === 401) {
              setError("Invalid email or password.");
            } else {
              const message = Array.isArray(data?.message)
                ? data.message.join(", ")
                : data?.message;
              setError(
                message ||
                  `Login failed with status ${status}. Please try again.`,
              );
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

  return { login, error, isLoading };
};
