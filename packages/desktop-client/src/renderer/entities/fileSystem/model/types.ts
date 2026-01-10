import { AudioStatus } from '@echomind/shared';

export interface FileNode {
  id: string
  name: string
  status: AudioStatus
  createdAt: string
  folderId?: string | null
}

export interface FolderNode {
  id: string
  name: string
  parentId?: string | null
}
