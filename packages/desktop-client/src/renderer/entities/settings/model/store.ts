import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ThemeMode } from '@renderer/shared/types/theme'

interface SettingsState {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'echo-mind-settings',
    }
  )
)
