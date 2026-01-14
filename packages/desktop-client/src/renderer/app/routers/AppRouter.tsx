import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardPage } from "@pages/Dashboard";
import { LoginPage } from "@pages/Login";
import { RegisterPage } from "@pages/Register";
import { PlaybackPage } from "@pages/Playback";
import { SettingsPage } from "@pages/Settings";
import { ProfilePage } from "@pages/Profile";
import { ProtectedRoute, PublicRoute } from "../providers/RouteGuards";
import { ROUTES } from "@renderer/shared/config/routes";

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={ROUTES.LOGIN}
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path={ROUTES.REGISTER}
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={`${ROUTES.PLAYBACK}/:id`}
          element={
            <ProtectedRoute>
              <PlaybackPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.SETTINGS}
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PROFILE}
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.HOME}
          element={<Navigate to={ROUTES.DASHBOARD} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};
