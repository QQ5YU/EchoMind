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
};
