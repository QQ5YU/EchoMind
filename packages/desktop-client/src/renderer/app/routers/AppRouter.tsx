import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DashboardPage } from '@pages/Dashboard'
import { LoginPage } from '@pages/Login'
import { RegisterPage } from '@pages/Register'
import { PlaybackPage } from '@pages/Playback'
import { SettingsPage } from '@pages/Settings'
import { ProfilePage } from '@pages/Profile'

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/playback/:id" element={<PlaybackPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
