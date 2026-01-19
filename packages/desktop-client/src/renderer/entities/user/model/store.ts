import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "./types";

interface AuthState {
  user: User | null;
  token: string | null;
  avatarBlobUrl: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (user: Partial<User>) => void;
  setAvatarBlobUrl: (url: string) => void;
  clearAvatarBlobUrl: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      avatarBlobUrl: null,
      isAuthenticated: false,
      setAuth: (user, access_token) =>
        set({ user, token: access_token, isAuthenticated: true, avatarBlobUrl: null }),
      updateUser: (newUserInfo) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...newUserInfo } : state.user,
        })),
      setAvatarBlobUrl: (url) => set({ avatarBlobUrl: url }),
      clearAvatarBlobUrl: () => set({ avatarBlobUrl: null }),
      logout: () => set({ user: null, token: null, avatarBlobUrl: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => {
        const { avatarBlobUrl, ...rest } = state;
        return rest;
      },
    }
  )
);
