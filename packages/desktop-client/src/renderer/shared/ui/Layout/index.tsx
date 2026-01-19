import React from "react";
import { Link } from "react-router-dom";
import logo from "@renderer/assets/logo/light/logo-wide.svg";
import logoDark from "@renderer/assets/logo/dark/logo-wide-dark.svg";
import { ROUTES } from "@renderer/shared/config/routes";

interface LayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  headerRight?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  sidebar,
  headerRight,
}) => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {sidebar && (
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 z-10">
          {sidebar}
        </aside>
      )}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 flex-shrink-0 z-10">
          <Link to={ROUTES.DASHBOARD} className="flex items-center gap-2">
            <img src={logo} alt="EchoMind" className="h-16 block dark:hidden" />
            <img
              src={logoDark}
              alt="EchoMind"
              className="h-16 hidden dark:block"
            />
          </Link>

          {headerRight}
        </header>
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>
    </div>
  );
};
