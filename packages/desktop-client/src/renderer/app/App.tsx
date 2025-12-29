import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PrimeReactProvider } from 'primereact/api'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DashboardPage } from '@pages/Dashboard'
import { LoginPage } from '@pages/Login'
import { RegisterPage } from '@pages/Register'
import { PlaybackPage } from '@pages/Playback'
import { SettingsPage } from '@pages/Settings'
import { ProfilePage } from '@pages/Profile'

const queryClient = new QueryClient()

function App() {
  return (
    <PrimeReactProvider>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </PrimeReactProvider>
  )
}

export default App