import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Message } from "primereact/message";

import { AuthLayout } from "@renderer/shared/ui/Auth/AuthLayout";
import { useAuthStore } from "@entities/user/model/store";
import { userApi } from "@entities/user/api/userApi";

import { RegisterForm, RegisterFormData } from "./ui/RegisterForm";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = useCallback(async (credentials: RegisterFormData) => {
    setError(null);
    
    try {
      const { data } = await userApi.register(credentials);
      
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
      } else if (status === 409) {
        setError("Email already exists. Please use another one.");
      } else {
        // 500 errors are logged by axios interceptor, we just show a generic message or the backend message
        setError(err.response?.data?.message || "Registration failed. Please try again.");
      }
    }
  }, [navigate, setAuth]);

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
      
      <RegisterForm onSubmit={handleRegister} />
    </AuthLayout>
  );
};