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
