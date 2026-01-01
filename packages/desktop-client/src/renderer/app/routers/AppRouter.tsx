import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DashboardPage } from '@pages/Dashboard'
import { LoginPage } from '@pages/Login'
import { RegisterPage } from '@pages/Register'
import { PlaybackPage } from '@pages/Playback'
import { SettingsPage } from '@pages/Settings'
import { ProfilePage } from '@pages/Profile'
import { useAuthStore } from '@entities/user/model/store'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  return <>{children}</>
}

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/playback/:id"
          element={
            <ProtectedRoute>
              <PlaybackPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
