import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Message } from "primereact/message";

import { AuthLayout } from "@renderer/shared/ui/Auth/AuthLayout";
import { useAuthStore } from "@entities/user/model/store";
import { userApi } from "@entities/user/api/userApi";

import { LoginForm, LoginFormData } from "./ui/LoginForm";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = useCallback(async (credentials: LoginFormData) => {
    setError(null);

    try {
      const { data } = await userApi.login(credentials);

      if (data?.user && data?.access_token) {
        setAuth(data.user, data.access_token);
        navigate("/dashboard");
      } else {
        throw new Error("Invalid server response");
      }
    } catch (err: any) {
      const status = err.response?.status;
      const code = err.code;

      if (code === "ERR_NETWORK") {
        setError("Unable to connect to the server. Please check your connection.");
      } else if (status === 401) {
        setError("Invalid email or password.");
      } else {
        // 500 errors are logged by axios interceptor
        setError(err.response?.data?.message || "Login failed. Please try again.");
      }
    }
  }, [navigate, setAuth]);

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue your journey"
      footer={
        <div className="text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
          </span>
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Sign up
          </Link>
        </div>
      }
    >
      {error && (
        <div className="mb-4 animate-fadein">
          <Message severity="error" text={error} className="w-full" />
        </div>
      )}
      <LoginForm onSubmit={handleLogin} />
    </AuthLayout>
  );
};