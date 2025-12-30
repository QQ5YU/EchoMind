import React from "react";
import logo from "@renderer/assets/logo/light/logo.svg";
import logoDark from "@renderer/assets/logo/dark/logo-dark.svg";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  logoHeight?: string; // Optional prop to control logo height if needed, default to h-48 or h-32 based on usage
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
  footer,
  logoHeight = "h-32", // Defaulting to a middle ground or explicit
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-indigo-50 via-white to-pink-50 dark:from-gray-950 dark:via-slate-900 dark:to-indigo-950">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl ring-1 ring-indigo-100 dark:ring-gray-700 border border-transparent dark:border-gray-700">
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="EchoMind Logo"
            className={`mx-auto mb-4 ${logoHeight} block dark:hidden`}
          />
          <img
            src={logoDark}
            alt="EchoMind Logo"
            className={`mx-auto mb-4 ${logoHeight} hidden dark:block`}
          />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {title}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">{subtitle}</p>
        </div>

        {children}

        {footer && (
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
