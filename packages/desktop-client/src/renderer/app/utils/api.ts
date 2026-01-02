import { useAuthStore } from '@entities/user';
import { createApiClient } from '@shared/api';
import { toastService } from '@shared/services';

const getTokenFromStore = () => {
  return useAuthStore.getState().token;
};

const handleUnauthorized = () => {
  useAuthStore.getState().logout();
  window.location.href = '/login';
};

export const api = createApiClient(toastService, getTokenFromStore, handleUnauthorized);