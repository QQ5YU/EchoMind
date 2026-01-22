import { api } from "@shared/api";
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  UpdateUser,
} from "../model/types";
import { AxiosProgressEvent } from "axios";

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

  uploadAvatar: (
    data: FormData,
    onUploadProgress: (progressEvent: AxiosProgressEvent) => void,
  ) => {
    return api.post<User>("/api/user/avatar", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  },

  getAvatar: (url: string) => {
    return api.get<Blob>(url, {
      responseType: "blob",
    });
  },
};
