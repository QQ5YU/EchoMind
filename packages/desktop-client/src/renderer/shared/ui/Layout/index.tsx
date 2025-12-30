import React from "react";
import logo from "@renderer/assets/logo-wide.svg";
import { UserMenu } from "../UserMenu";

interface LayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children, sidebar }) => {
  return (
    <div className="flex h-screen surface-ground overflow-hidden">
      {sidebar && (
        <aside className="w-64 surface-section shadow-sm flex-shrink-0 z-10">
          {sidebar}
        </aside>
      )}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 surface-section shadow-sm flex items-center justify-between px-6 flex-shrink-0 z-10">
          <div className="flex items-center gap-2">
            <img src={logo} alt="EchoMind" className="h-16" />
          </div>

          <UserMenu />
        </header>
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>
    </div>
  );
};
