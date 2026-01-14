import React from 'react'
import { SelectButton } from 'primereact/selectbutton'
import { ThemeMode } from '@renderer/shared/types/theme'

interface ThemeOption {
  label: string
  value: ThemeMode
  icon: string
}

interface ThemeSettingsProps {
  theme: ThemeMode
  onChange: (theme: ThemeMode) => void
}

export const ThemeSettings: React.FC<ThemeSettingsProps> = ({ theme, onChange }) => {
  const options: ThemeOption[] = [
    { label: 'Light', value: 'light', icon: 'pi pi-sun' },
    { label: 'Dark', value: 'dark', icon: 'pi pi-moon' }
  ]

  const itemTemplate = (option: ThemeOption) => {
    return (
      <div className="flex items-center gap-2">
        <i className={option.icon} />
        <span>{option.label}</span>
      </div>
    )
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 border-b dark:border-gray-700 pb-2">Appearance</h2>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Theme Mode</label>
        <SelectButton 
          value={theme} 
          options={options} 
          onChange={(e) => e.value && onChange(e.value)} 
          itemTemplate={itemTemplate}
          className="w-fit"
        />
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Switch between light and dark visual styles.</p>
      </div>
    </section>
  )
}