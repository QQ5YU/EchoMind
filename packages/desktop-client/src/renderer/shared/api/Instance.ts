import { createAxiosInstance } from "./core/client";
import {
  setupRequestInterceptor,
  setupResponseInterceptor,
} from "./core/interceptors";
import { ipcAdapter } from "./adapters/ipc.adapter";
import { toastService } from "@shared/utils";

let getToken: () => string | null = () => null;
let onUnauthorized: () => void = () => {};

export const setupApi = (
  getTokenFn: () => string | null,
  onUnauthorizedFn: () => void,
) => {
  getToken = getTokenFn;
  onUnauthorized = onUnauthorizedFn;
};

const getTokenFromStore = () => getToken();
const handleUnauthorized = () => onUnauthorized();

const adapter =
  typeof window !== "undefined" && typeof window.api !== "undefined"
    ? ipcAdapter
    : undefined;

export const api = createAxiosInstance({
  adapter,
});

setupRequestInterceptor(api, getTokenFromStore);
setupResponseInterceptor(api, toastService, handleUnauthorized);
