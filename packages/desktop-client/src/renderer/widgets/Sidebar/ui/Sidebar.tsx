import React, { useRef } from 'react'
import { Button } from 'primereact/button'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFileBrowserStore } from '@features/fileBrowser'
import { useFileSystemStore } from '@entities/fileSystem'
import { SidebarNavItem } from './SidebarNavItem'
import { SidebarFolderList } from './SidebarFolderList'
import { ROUTES } from '@renderer/shared/config/routes'

export const Sidebar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentFolderId, setCurrentFolder } = useFileBrowserStore()
  const uploadFile = useFileSystemStore((state) => state.uploadFile)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const isSettingsPage = location.pathname === ROUTES.SETTINGS
  const isDashboardPage = location.pathname === ROUTES.DASHBOARD

  const handleNavigateHome = () => {
    setCurrentFolder(null)
    if (!isDashboardPage) {
      navigate(ROUTES.DASHBOARD)
    }
  }

  const handleNavigateSettings = () => {
    navigate(ROUTES.SETTINGS)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadFile(file)
      e.target.value = ''
    }
  }

  return (
    <div className="p-4 flex flex-col h-full">
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="audio/*" 
        onChange={handleFileChange} 
      />
      <Button 
        label="Upload Audio" 
        icon="pi pi-upload" 
        className="w-full text-white" 
        onClick={handleUploadClick}
      />
      
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
