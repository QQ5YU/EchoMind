import React, { useState } from 'react'
import { Layout } from '@shared/ui/Layout'
import { useNavigate } from 'react-router-dom'
import { useFileSystemStore } from '@entities/fileSystem/store'
import { DashboardSidebar } from '@features/dashboard/components/DashboardSidebar'
import { SearchBar } from '@features/dashboard/components/SearchBar'
import { DeleteFileDialog } from '@features/fileSystem/components/DeleteFileDialog'
import { FileCard } from '@features/fileSystem/components/FileCard'

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { folders, files, currentFolderId, deleteFile } = useFileSystemStore()
  
  const [deleteFileId, setDeleteFileId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFiles = files.filter(f => {
    const matchesFolder = currentFolderId ? f.folderId === currentFolderId : true
    const matchesSearch = searchQuery ? f.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
    return matchesFolder && matchesSearch
  })

  const currentFolderName = currentFolderId 
    ? folders.find(f => f.id === currentFolderId)?.name 
    : 'All Files'

  const handleConfirmDeleteFile = () => {
    if (deleteFileId) {
      deleteFile(deleteFileId)
      setDeleteFileId(null)
    }
  }

  return (
    <Layout sidebar={<DashboardSidebar />}>
      <div className="max-w-5xl mx-auto">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">{currentFolderName}</h2>
            <span className="text-sm text-gray-500">{filteredFiles.length} files</span>
          </div>
          
          {filteredFiles.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <i className="pi pi-folder-open text-4xl text-gray-300 mb-3" />
              <p className="text-gray-500">
                {searchQuery ? 'No files match your search' : 'No files in this folder'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFiles.map((file) => (
                <FileCard 
                  key={file.id}
                  file={file}
                  onClick={(id) => navigate(`/playback/${id}`)}
                  onDelete={(id) => setDeleteFileId(id)}
                />
              ))}
            </div>
          )}
        </section>

        <DeleteFileDialog 
          visible={!!deleteFileId} 
          onHide={() => setDeleteFileId(null)} 
          onConfirm={handleConfirmDeleteFile} 
        />
      </div>
    </Layout>
  )
}
