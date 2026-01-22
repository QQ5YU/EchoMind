import { create } from "zustand";

interface FileBrowserState {
  currentFolderId: string | null;
  setCurrentFolder: (folderId: string | null) => void;
}

export const useFileBrowserStore = create<FileBrowserState>((set) => ({
  currentFolderId: null,
  setCurrentFolder: (folderId) => set({ currentFolderId: folderId }),
}));
