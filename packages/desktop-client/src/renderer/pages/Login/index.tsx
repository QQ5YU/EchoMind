import React, { useState } from "react";
import { Card } from "primereact/card";
import { LoginForm } from "./ui/LoginForm";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@shared/api/axios-client";
import { useAuthStore } from "@entities/user/model/store";
import { Message } from "primereact/message";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (data: any) => {
    try {
      setError(null);
      const response = await api.post("/auth/login", data);

      if (response) {
        const { user, access_token } = response.data;
        setAuth(user, access_token);
        navigate("/dashboard");
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md p-4 shadow-lg">
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            EchoMind
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Sign in to your account
          </p>
        </div>

        {error && (
          <Message severity="error" text={error} className="mb-4 w-full" />
        )}

        <LoginForm onSubmit={handleLogin} />

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
          </span>
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
};
