import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { classNames } from "primereact/utils";
import { RegisterSchema, RegisterRequestDto } from "@echomind/shared";

export type RegisterFormData = RegisterRequestDto;

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
  serverErrors?: Partial<Record<keyof RegisterFormData, string>>;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  serverErrors,
}) => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (serverErrors) {
      Object.entries(serverErrors).forEach(([key, message]) => {
        if (message) {
          setError(key as keyof RegisterFormData, {
            type: "server",
            message,
          });
        }
      });
    }
  }, [serverErrors, setError]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-fluid">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="name"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Full Name
        </label>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <InputText
                id={field.name}
                {...field}
                className={classNames({ "p-invalid": fieldState.invalid })}
                placeholder="Your Name"
              />
              {fieldState.error && (
                <small className="p-error text-red-500">
                  {fieldState.error.message}
                </small>
              )}
            </>
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Email
        </label>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <InputText
                id={field.name}
                {...field}
                className={classNames({ "p-invalid": fieldState.invalid })}
                placeholder="name@example.com"
              />
              {fieldState.error && (
                <small className="p-error text-red-500">
                  {fieldState.error.message}
                </small>
              )}
            </>
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Password
        </label>
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <Password
                id={field.name}
                {...field}
                className={classNames({ "p-invalid": fieldState.invalid })}
                toggleMask
                feedback={true}
                inputClassName="w-full"
              />
              {fieldState.error && (
                <small className="p-error text-red-500">
                  {fieldState.error.message}
                </small>
              )}
            </>
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Confirm Password
        </label>
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <Password
                id={field.name}
                {...field}
                className={classNames({ "p-invalid": fieldState.invalid })}
                toggleMask
                feedback={false}
                placeholder="Confirm your password"
                inputClassName="w-full"
              />
              {fieldState.error && (
                <small className="p-error text-red-500">
                  {fieldState.error.message}
                </small>
              )}
            </>
          )}
        />
      </div>

      <Button
        label="Create Account"
        type="submit"
        loading={isSubmitting}
        className="text-white"
      />
    </form>
  );
};
