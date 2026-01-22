import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "./types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, access_token) =>
        set({ user, token: access_token, isAuthenticated: true }),
      updateUser: (newUserInfo) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...newUserInfo } : state.user,
        })),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => {
        return state;
      },
    },
  ),
);
