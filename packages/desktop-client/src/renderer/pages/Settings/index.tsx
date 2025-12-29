import React, { useState, useRef } from 'react'
import { Layout } from '@shared/ui/Layout'
import { DashboardSidebar } from '@features/dashboard/components/DashboardSidebar'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { TranscriptionSettings } from '@features/settings/components/TranscriptionSettings'
import { ThemeSettings } from '@features/settings/components/ThemeSettings'
import { useSettingsStore } from '@entities/settings/store'

export const SettingsPage: React.FC = () => {
  const [language, setLanguage] = useState('en')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const toast = useRef<Toast>(null)

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleSave = () => {
    // Simulate API call
    setTimeout(() => {
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Settings saved successfully', life: 3000 })
    }, 500)
  }

  return (
    <Layout sidebar={<DashboardSidebar />}>
      <Toast ref={toast} />
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">App Settings</h1>
        
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-12">
          <ThemeSettings theme={theme} onChange={handleThemeChange} />
          
          <TranscriptionSettings language={language} onChange={setLanguage} />

          <div className="pt-6 border-t flex justify-end">
            <Button label="Save Changes" icon="pi pi-check" onClick={handleSave} />
          </div>
        </div>
      </div>
    </Layout>
  )
}
