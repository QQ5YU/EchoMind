import { api } from '@shared/api/axios-client';
import { AuthResponse, LoginRequest, RegisterRequest } from '../model/types';

export const userApi = {
  login: (data: LoginRequest) => {
    return api.post<AuthResponse>('/api/auth/login', data);
  },

  register: (data: RegisterRequest) => {
    return api.post<AuthResponse>('/api/auth/register', data);
  },
};
