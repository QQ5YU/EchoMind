import React, { useState } from "react";
import { LoginForm, LoginFormData } from "./ui/LoginForm";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@entities/user/model/store";
import { userApi } from "@entities/user/api/userApi";
import { Message } from "primereact/message";
import { AuthLayout } from "@renderer/shared/ui/Auth/AuthLayout";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (credentials: LoginFormData) => {
    try {
      setError(null);
      const response = await userApi.login(credentials);

      const { data } = response;
      if (!data?.user || !data?.access_token) {
        throw new Error("Invalid response format from server");
      }

      const { user, access_token } = response.data;
      setAuth(user, access_token);
      navigate("/dashboard");
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue your journey"
      footer={
        <>
          <span className="text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
          </span>
          <button
            onClick={() => navigate("/register")}
            className="font-medium text-blue-600 hover:underline"
          >
            Sign up
          </button>
        </>
      }
    >
      {error && (
        <div className="mb-4">
          <Message severity="error" text={error} className="w-full" />
        </div>
      )}
      <LoginForm onSubmit={handleLogin} />
    </AuthLayout>
  );
};
