import { useEffect } from 'react'
import { useSettingsStore } from '@entities/settings'

export const useTheme = () => {
  const { theme } = useSettingsStore()

  useEffect(() => {
    // Update PrimeReact theme
    const themeLink = document.getElementById('theme-link') as HTMLLinkElement
    if (themeLink) {
      const newHref = `./themes/lara-${theme}-indigo/theme.css`
      themeLink.href = newHref
    }

    // Update Tailwind dark mode
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return { theme }
}
