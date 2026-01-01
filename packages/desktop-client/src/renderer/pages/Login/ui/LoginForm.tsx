import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-fluid">
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-200">
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
                className={classNames({ 'p-invalid': fieldState.invalid })}
                placeholder="name@example.com"
              />
              {fieldState.error && (
                <small className="p-error text-red-500">{fieldState.error.message}</small>
              )}
            </>
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-200">
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
                className={classNames({ 'p-invalid': fieldState.invalid })}
                toggleMask
                feedback={false}
                inputClassName="w-full"
              />
              {fieldState.error && (
                <small className="p-error text-red-500">{fieldState.error.message}</small>
              )}
            </>
          )}
        />
      </div>

      <Button label="Login" type="submit" loading={isSubmitting} className="text-white" />
    </form>
  );
};