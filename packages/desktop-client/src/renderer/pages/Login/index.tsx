import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Message } from "primereact/message";

import { AuthLayout } from "@renderer/shared/ui/Auth/AuthLayout";
import { ROUTES } from "@renderer/shared/config/routes";
import { useLogin } from "./hooks/useLogin";
import { LoginForm, LoginFormData } from "./ui/LoginForm";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, error } = useLogin();

  const handleLogin = async (credentials: LoginFormData) => {
    const success = await login(credentials);
    if (success) {
      navigate(ROUTES.DASHBOARD);
    }
  };

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
            to={ROUTES.REGISTER}
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
