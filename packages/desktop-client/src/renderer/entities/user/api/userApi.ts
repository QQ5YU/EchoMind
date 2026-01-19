import { api } from "@renderer/app/utils/api";
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  UpdateUser,
} from "../model/types";

export const userApi = {
  login: (data: LoginRequest) => {
    return api.post<AuthResponse>("/api/auth/login", data);
  },

  register: (data: RegisterRequest) => {
    return api.post<AuthResponse>("/api/auth/register", data);
  },

  getInfo: () => {
    return api.get<User>("/api/user/info");
  },

  updateProfile: (data: UpdateUser) => {
    return api.patch<User>("/api/user/info", data);
  },

  uploadAvatar: (data: FormData) => {
    return api.post<User>("/api/user/avatar", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getAvatar: (userId: string) => {
    return api.get<Blob>(`/api/user/avatar/${userId}`, {
      responseType: 'blob',
    });
  },
};
