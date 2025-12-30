import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@renderer/shared/ui/Auth/AuthLayout";
import { RegisterForm } from "./ui/RegisterForm";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout
      title="Join EchoMind"
      subtitle="Create an account to start transcribing"
      logoHeight="h-32"
      footer={
        <button
          onClick={() => navigate("/login")}
          className="text-primary hover:underline"
        >
          Already have an account? Login
        </button>
      }
    >
      <RegisterForm onSubmit={() => navigate("/dashboard")} />
    </AuthLayout>
  );
};