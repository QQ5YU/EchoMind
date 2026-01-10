import { useAuthStore } from '@entities/user';
import { createApiClient, ipcAdapter } from '@shared/api';
import { toastService } from '@shared/services';

const getTokenFromStore = () => {
  return useAuthStore.getState().token;
};

const handleUnauthorized = () => {
  useAuthStore.getState().logout();
};

/**
 * Determine the appropriate adapter based on the environment.
 */
const adapter = typeof window !== 'undefined' && window.api ? ipcAdapter : undefined;

export const api = createApiClient(
  toastService, 
  getTokenFromStore, 
  handleUnauthorized, 
  adapter
);