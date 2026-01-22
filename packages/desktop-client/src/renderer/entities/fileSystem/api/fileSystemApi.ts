import { api } from "@shared/api";
import { FileNode, FolderNode } from "../model/types";
import { AudioFileDto, FolderDto } from "@echomind/shared";

export const fileSystemApi = {
  fetchFiles: async (): Promise<FileNode[]> => {
    const { data } = await api.get<AudioFileDto[]>("/api/audio");
    return data.map((audio) => ({
      id: audio.id,
      name: audio.fileName,
      status: audio.status,
      createdAt: audio.createdAt,
      folderId: audio.folderId,
    }));
  },

  fetchFolders: async (): Promise<FolderNode[]> => {
    const { data } = await api.get<FolderDto[]>("/api/folders");
    return data.map((folder) => ({
      id: folder.id,
      name: folder.name,
      parentId: folder.parentId,
    }));
  },

  createFolder: async (
    name: string,
    parentId?: string,
  ): Promise<FolderNode> => {
    const { data } = await api.post<FolderDto>("/api/folders", {
      name,
      parentId,
    });
    return {
      id: data.id,
      name: data.name,
      parentId: data.parentId,
    };
  },

  uploadFile: async (file: File): Promise<FileNode> => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await api.post<AudioFileDto>("/api/audio", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      id: data.id,
      name: data.fileName,
      status: data.status,
      createdAt: data.createdAt,
      folderId: data.folderId,
    };
  },

  deleteFile: async (id: string): Promise<void> => {
    await api.delete(`/api/audio/${id}`);
  },

  deleteFolder: async (id: string): Promise<void> => {
    const res = await api.delete(`/api/folders/${id}`);
    console.log(res);
  },
};
