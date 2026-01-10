import { AxiosAdapter, AxiosError } from 'axios';

/**
 * Custom Axios Adapter that routes requests through Electron IPC.
 * This allows the renderer process to communicate with the embedded NestJS backend.
 */
export const ipcAdapter: AxiosAdapter = async (config) => {
  try {
    const response = await window.api.invoke('api-request', {
      method: config.method,
      url: config.url,
      data: config.data,
      params: config.params,
      headers: config.headers,
    });

    if (response.error) {
      throw new AxiosError(
        response.data?.message || 'Request failed',
        String(response.status),
        config,
        undefined,
        {
          data: response.data,
          status: response.status,
          statusText: 'Error',
          headers: {},
          config,
        }
      );
    }

    return {
      data: response.data,
      status: response.status,
      statusText: 'OK',
      headers: response.headers,
      config,
    };
  } catch (error) {
    return Promise.reject(error);
  }
};
