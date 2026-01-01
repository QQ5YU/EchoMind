import React from "react";
import { RegisterForm, RegisterFormData } from "./ui/RegisterForm";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@entities/user/model/store";
import { userApi } from "@entities/user/api/userApi";
import { Message } from "primereact/message";
import { AuthLayout } from "@renderer/shared/ui/Auth/AuthLayout";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = React.useState<string | null>(null);

  const handleRegister = async (credentials: RegisterFormData) => {
    try {
      setError(null);
      const response = await userApi.register(credentials);
      console.log("response: ", response);

      const { data } = response;
      if (!data?.user || !data?.access_token) {
        throw new Error("Invalid response format from server");
      }

      const { user, access_token } = response.data;
      setAuth(user, access_token);
      navigate("/dashboard");
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError("Email already exists");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join us and start your journey"
      footer={
        <>
          <span className="text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
          </span>
          <button
            onClick={() => navigate("/login")}
            className="font-medium text-blue-600 hover:underline"
          >
            Sign in
          </button>
        </>
      }
    >
      {error && (
        <div className="mb-4">
          <Message severity="error" text={error} className="w-full" />
        </div>
      )}
      <RegisterForm onSubmit={handleRegister} />
    </AuthLayout>
  );
};
