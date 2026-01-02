import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@entities/user";

interface RouteGuardProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<RouteGuardProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export const PublicRoute: React.FC<RouteGuardProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};
