import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { Message } from "primereact/message";
import { ApiError } from "@renderer/shared/api/types";

import { AuthLayout } from "@renderer/shared/ui/Auth/AuthLayout";
import { useAuthStore } from "@entities/user/model/store";
import { userApi } from "@entities/user/api/userApi";

import {
  RegisterForm,
  RegisterFormData,
} from "./ui/RegisterForm";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof RegisterFormData, string>>
  >({});

  const handleRegister = useCallback(
    async (credentials: RegisterFormData) => {
      setError(null);
      setFieldErrors({});

      try {
        const { data } = await userApi.register(credentials);

        if (data?.user && data?.access_token) {
          setAuth(data.user, data.access_token);
          navigate("/dashboard");
        } else {
          throw new Error("Invalid server response");
        }
      } catch (err) {
        if (isAxiosError<ApiError>(err)) {
          if (err.response) {
            const { status, data } = err.response;
            if (status === 409) {
              // Map 409 Conflict to the email field
              setFieldErrors({
                email: "Email already exists. Please use another one.",
              });
            } else {
              // 500 errors are logged by axios interceptor, we just show a generic message or the backend message
              setError(
                data?.message || "Registration failed. Please try again."
              );
            }
            return;
          }
        }

        setError("An unexpected error occurred. Please try again.");
      }
    },
    [navigate, setAuth]
  );

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join us and start your journey"
      footer={
        <div className="text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
          </span>
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Sign in
          </Link>
        </div>
      }
    >
      {error && (
        <div className="mb-4 animate-fadein">
          <Message severity="error" text={error} className="w-full" />
        </div>
      )}

      <RegisterForm onSubmit={handleRegister} serverErrors={fieldErrors} />
    </AuthLayout>
  );
};