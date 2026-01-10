import { create } from 'zustand'
import { FileNode, FolderNode } from './types'
import { fileSystemApi } from '../api/fileSystemApi'
import { toastService } from '@renderer/shared/services/toast-notification.service'
import { ToastSeverity } from '@renderer/shared/enum/enum'

interface FileSystemState {
  folders: FolderNode[]
  files: FileNode[]
  isLoading: boolean
  error: string | null
  fetchAll: () => Promise<void>
  addFolder: (name: string, parentId?: string) => Promise<void>
  uploadFile: (file: File) => Promise<void>
  deleteFolder: (id: string) => Promise<void>
  deleteFile: (id: string) => Promise<void>
}

export const useFileSystemStore = create<FileSystemState>((set) => ({
  folders: [],
  files: [],
  isLoading: false,
  error: null,

  fetchAll: async () => {
    set({ isLoading: true, error: null })
    try {
      const [files, folders] = await Promise.all([
        fileSystemApi.fetchFiles(),
        fileSystemApi.fetchFolders()
      ])
      set({ files, folders, isLoading: false })
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Failed to fetch data' })
      toastService.show(ToastSeverity.ERROR, `Failed to load data: ${err.message || 'Unknown error'}`)
    }
  },

  addFolder: async (name, parentId) => {
    try {
      const newFolder = await fileSystemApi.createFolder(name, parentId)
      set((state) => ({
        folders: [...state.folders, newFolder]
      }))
      toastService.show(ToastSeverity.SUCCESS, `Folder "${name}" created successfully`)
    } catch (err: any) {
      console.error('Failed to create folder:', err)
      toastService.show(ToastSeverity.ERROR, `Failed to create folder: ${err.message || 'Unknown error'}`)
    }
  },
  
  uploadFile: async (file) => {
    try {
      const newFile = await fileSystemApi.uploadFile(file)
      set((state) => ({
        files: [...state.files, newFile]
      }))
      toastService.show(ToastSeverity.SUCCESS, `File "${file.name}" uploaded successfully`)
    } catch (err: any) {
       console.error('Failed to upload file:', err)
       toastService.show(ToastSeverity.ERROR, `Failed to upload file: ${err.message || 'Unknown error'}`)
    }
  },
  
  deleteFolder: async (id) => {
    const folderName = useFileSystemStore.getState().folders.find(f => f.id === id)?.name || 'Folder'
    try {
        await fileSystemApi.deleteFolder(id)
        set((state) => ({
            folders: state.folders.filter(f => f.id !== id),
            files: state.files.map(f => f.folderId === id ? { ...f, folderId: null } : f)
        }))
        toastService.show(ToastSeverity.SUCCESS, `Folder "${folderName}" deleted successfully`)
    } catch (err: any) {
        console.error("Delete folder failed", err)
        toastService.show(ToastSeverity.ERROR, `Failed to delete folder: ${err.message || 'Unknown error'}`)
    }
  },

  deleteFile: async (id) => {
    const fileName = useFileSystemStore.getState().files.find(f => f.id === id)?.name || 'File'
    try {
        await fileSystemApi.deleteFile(id)
        set((state) => ({
            files: state.files.filter(f => f.id !== id)
        }))
        toastService.show(ToastSeverity.SUCCESS, `File "${fileName}" deleted successfully`)
    } catch (err: any) {
        console.error("Delete file failed", err)
        toastService.show(ToastSeverity.ERROR, `Failed to delete file: ${err.message || 'Unknown error'}`)
    }
  }
}))
