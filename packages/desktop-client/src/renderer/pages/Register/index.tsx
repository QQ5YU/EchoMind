import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Message } from "primereact/message";

import { AuthLayout } from "@renderer/shared/ui/Auth/AuthLayout";
import { ROUTES } from "@renderer/shared/config/routes";
import { useRegister } from "./hooks/useRegister";
import { RegisterForm, RegisterFormData } from "./ui/RegisterForm";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, error, fieldErrors } = useRegister();

  const handleRegister = async (credentials: RegisterFormData) => {
    const success = await register(credentials);
    if (success) {
      navigate(ROUTES.DASHBOARD);
    }
  };

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
            to={ROUTES.LOGIN}
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
