import { create } from "zustand";
import { FileNode, FolderNode } from "./types";
import { fileSystemApi } from "../api/fileSystemApi";
import { toastService } from "@shared/utils";
import { ToastSeverity } from "@renderer/shared/config";
import { getErrorMessage } from "@renderer/shared";

interface FileSystemState {
  folders: FolderNode[];
  files: FileNode[];
  isLoading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  addFolder: (name: string, parentId?: string) => Promise<void>;
  uploadFile: (file: File, folderId?: string | null) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
}

export const useFileSystemStore = create<FileSystemState>((set) => ({
  folders: [],
  files: [],
  isLoading: false,
  error: null,

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const [files, folders] = await Promise.all([
        fileSystemApi.fetchFiles(),
        fileSystemApi.fetchFolders(),
      ]);
      set({ files, folders, isLoading: false });
    } catch (err) {
      const message = getErrorMessage(err, "Failed to load data");
      set({ isLoading: false, error: message });
    }
  },

  addFolder: async (name, parentId) => {
    try {
      const newFolder = await fileSystemApi.createFolder(name, parentId);
      set((state) => ({
        folders: [...state.folders, newFolder],
      }));
      toastService.show(
        ToastSeverity.SUCCESS,
        `Folder "${name}" created successfully`,
      );
    } catch (err) {
      const errorMsg = getErrorMessage(err, "Failed to create folder");
      toastService.show(ToastSeverity.ERROR, errorMsg);
    }
  },

  uploadFile: async (file, folderId) => {
    try {
      const newFile = await fileSystemApi.uploadFile(file, folderId);
      set((state) => ({
        files: [...state.files, newFile],
      }));
      toastService.show(
        ToastSeverity.SUCCESS,
        `File "${file.name}" uploaded successfully`,
      );
    } catch (err) {
      getErrorMessage(err, "Failed to upload file");
    }
  },

  deleteFolder: async (id) => {
    const folderName =
      useFileSystemStore.getState().folders.find((f) => f.id === id)?.name ||
      "Folder";
    try {
      await fileSystemApi.deleteFolder(id);
      set((state) => ({
        folders: state.folders.filter((f) => f.id !== id),
        files: state.files.map((f) =>
          f.folderId === id ? { ...f, folderId: null } : f,
        ),
      }));
      toastService.show(
        ToastSeverity.SUCCESS,
        `Folder "${folderName}" deleted successfully`,
      );
    } catch (err) {
      getErrorMessage(err, "Failed to delete folder");
    }
  },

  deleteFile: async (id) => {
    const fileName =
      useFileSystemStore.getState().files.find((f) => f.id === id)?.name ||
      "File";
    try {
      await fileSystemApi.deleteFile(id);
      set((state) => ({
        files: state.files.filter((f) => f.id !== id),
      }));
      toastService.show(
        ToastSeverity.SUCCESS,
        `File "${fileName}" deleted successfully`,
      );
    } catch (err) {
      getErrorMessage(err, "Failed to delete file");
    }
  },
}));
