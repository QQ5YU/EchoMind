import React from 'react'
import { Button } from 'primereact/button'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFileBrowserStore } from '@features/fileBrowser'
import { SidebarNavItem } from './SidebarNavItem'
import { SidebarFolderList } from './SidebarFolderList'

export const Sidebar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentFolderId, setCurrentFolder } = useFileBrowserStore()
  
  const isSettingsPage = location.pathname === '/settings'
  const isDashboardPage = location.pathname === '/dashboard'

  const handleNavigateHome = () => {
    setCurrentFolder(null)
    if (!isDashboardPage) {
      navigate('/dashboard')
    }
  }

  const handleNavigateSettings = () => {
    navigate('/settings')
  }

  return (
    <div className="p-4 flex flex-col h-full">
      <Button label="Upload Audio" icon="pi pi-upload" className="w-full text-white" />
      
      <nav className="flex-1 mt-6 overflow-y-auto min-h-0">
        <ul className="space-y-2">
          <SidebarNavItem 
            icon="pi-home"
            label="All Files"
            isActive={!isSettingsPage && currentFolderId === null}
            onClick={handleNavigateHome}
          />

          <SidebarFolderList />
        </ul>
      </nav>

      <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-700">
        <ul className="space-y-2">
          <SidebarNavItem 
            icon="pi-cog"
            label="Settings"
            isActive={isSettingsPage}
            onClick={handleNavigateSettings}
          />
        </ul>
      </div>
    </div>
  )
}
