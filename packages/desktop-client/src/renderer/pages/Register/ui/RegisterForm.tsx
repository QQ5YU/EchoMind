import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { classNames } from "primereact/utils";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

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
