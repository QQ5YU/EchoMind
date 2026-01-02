import axios, { AxiosInstance } from 'axios';
import type { INotificationService } from '@renderer/shared/types/interface';
import { ToastSeverity } from '@shared/enum/enum';

export const createApiClient = (
  notification: INotificationService,
  getToken: () => string | null,
  onUnauthorized: () => void
): AxiosInstance => {
  const api = axios.create({
    headers: {
      'Content-Type': 'application/json',
    },
  });

  api.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      switch (status) {
        case 401:
          notification.show(ToastSeverity.ERROR, error.response?.data || error.message);
          onUnauthorized();
          break;
        case 500:
          notification.show(ToastSeverity.ERROR, error.response?.data || error.message);
          console.error('Server Error:', error.response?.data || error.message);
          break;
        default:
          console.log(error);
      }

      return Promise.reject(error);
    }
  );

  return api;
}