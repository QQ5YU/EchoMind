import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@renderer/shared/ui/Auth/AuthLayout";
import { LoginForm } from "./ui/LoginForm";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue your journey"
      logoHeight="h-48"
      footer={
        <button
          onClick={() => navigate("/register")}
          className="text-primary hover:underline"
        >
          Need an account? Register
        </button>
      }
    >
      <LoginForm onSubmit={() => navigate("/dashboard")} />
    </AuthLayout>
  );
};