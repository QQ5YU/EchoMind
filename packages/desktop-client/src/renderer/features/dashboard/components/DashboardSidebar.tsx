import React, { useState } from 'react'
import { Button } from 'primereact/button'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFileSystemStore } from '@entities/fileSystem/store'
import { CreateFolderDialog } from '@features/fileSystem/components/CreateFolderDialog'
import { DeleteFolderDialog } from '@features/fileSystem/components/DeleteFolderDialog'

export const DashboardSidebar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { folders, currentFolderId, setCurrentFolder, addFolder, deleteFolder } = useFileSystemStore()
  
  const [isNewFolderVisible, setIsNewFolderVisible] = useState(false)
  const [deleteFolderId, setDeleteFolderId] = useState<string | null>(null)

  const isSettingsPage = location.pathname === '/settings'
  const isDashboardPage = location.pathname === '/dashboard'

  const handleConfirmDeleteFolder = () => {
    if (deleteFolderId) {
      deleteFolder(deleteFolderId)
      if (currentFolderId === deleteFolderId) setCurrentFolder(null)
    }
  }

  const handleNavigateDashboard = (folderId: string | null) => {
    setCurrentFolder(folderId)
    if (!isDashboardPage) {
      navigate('/dashboard')
    }
  }

  return (
    <div className="p-4 flex flex-col h-full">
      <Button label="Upload Audio" icon="pi pi-upload" className="w-full" />
      
      <nav className="flex-1 mt-6 overflow-y-auto min-h-0">
        <ul className="space-y-2">
          <li 
            className={`p-2 rounded cursor-pointer flex items-center gap-3 font-medium transition-colors ${
              !isSettingsPage && currentFolderId === null ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50 text-gray-600'
            }`}
            onClick={() => handleNavigateDashboard(null)}
          >
            <i className="pi pi-home" />
            <span>All Files</span>
          </li>

          <div className="pt-4 pb-2 flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <span>Folders</span>
            <button 
              onClick={() => setIsNewFolderVisible(true)}
              className="hover:text-indigo-600 p-1 rounded hover:bg-indigo-50 transition-colors"
            >
              <i className="pi pi-plus" />
            </button>
          </div>

          {folders.map(folder => (
            <li 
              key={folder.id}
              className={`p-2 rounded cursor-pointer flex items-center gap-3 transition-colors group justify-between ${
                !isSettingsPage && currentFolderId === folder.id ? 'bg-indigo-50 text-indigo-700 font-medium' : 'hover:bg-gray-50 text-gray-600'
              }`}
              onClick={() => handleNavigateDashboard(folder.id)}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <i className="pi pi-folder flex-shrink-0" />
                <span className="truncate">{folder.name}</span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  setDeleteFolderId(folder.id)
                }}
                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                title="Delete Folder"
              >
                <i className="pi pi-trash text-xs" />
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="pt-4 mt-2 border-t border-gray-100">
        <ul className="space-y-2">
          <li 
            className={`p-2 rounded cursor-pointer flex items-center gap-3 transition-colors ${
              isSettingsPage ? 'bg-indigo-50 text-indigo-700 font-medium' : 'hover:bg-gray-50 text-gray-600'
            }`}
            onClick={() => navigate('/settings')}
          >
            <i className="pi pi-cog" />
            <span>Settings</span>
          </li>
        </ul>
      </div>

      <CreateFolderDialog 
        visible={isNewFolderVisible} 
        onHide={() => setIsNewFolderVisible(false)} 
        onCreate={addFolder} 
      />

      <DeleteFolderDialog 
        visible={!!deleteFolderId} 
        onHide={() => setDeleteFolderId(null)} 
        onConfirm={handleConfirmDeleteFolder} 
      />
    </div>
  )
}
