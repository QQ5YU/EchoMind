import { create } from 'zustand'

export interface FileNode {
  id: string
  name: string
  status: 'uploading' | 'processing' | 'processed' | 'error'
  createdAt: string
  folderId?: string | null
}

export interface FolderNode {
  id: string
  name: string
}

interface FileSystemState {
  folders: FolderNode[]
  files: FileNode[]
  currentFolderId: string | null // null means 'All Files'
  
  addFolder: (name: string) => void
  addFile: (file: FileNode) => void
  setCurrentFolder: (folderId: string | null) => void
  deleteFolder: (id: string) => void
  deleteFile: (id: string) => void
}

export const useFileSystemStore = create<FileSystemState>((set) => ({
  folders: [
    { id: '1', name: 'Project Alpha' },
    { id: '2', name: 'Interviews' }
  ],
  files: [
    { id: '1', name: 'Meeting_Notes_1.mp3', status: 'processed', createdAt: 'Dec 25, 2025', folderId: '1' },
    { id: '2', name: 'Kickoff_Call.mp3', status: 'processed', createdAt: 'Dec 26, 2025', folderId: null },
    { id: '3', name: 'User_Research_A.mp3', status: 'processing', createdAt: 'Dec 29, 2025', folderId: '2' }
  ],
  currentFolderId: null,

  addFolder: (name) => set((state) => ({
    folders: [...state.folders, { id: Math.random().toString(36).substr(2, 9), name }]
  })),
  
  addFile: (file) => set((state) => ({
    files: [...state.files, file]
  })),
  
  setCurrentFolder: (folderId) => set({ currentFolderId: folderId }),

  deleteFolder: (id) => set((state) => ({
    folders: state.folders.filter(f => f.id !== id),
    // Move files in deleted folder to root (optional)
    files: state.files.map(f => f.folderId === id ? { ...f, folderId: null } : f)
  })),

  deleteFile: (id) => set((state) => ({
    files: state.files.filter(f => f.id !== id)
  }))
}))
