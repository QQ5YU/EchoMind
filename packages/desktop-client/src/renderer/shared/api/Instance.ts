import { createApiClient } from "./client";
import { ipcAdapter } from "./adapters";
import { toastService } from "@shared/services";

let getToken: () => string | null = () => null;
let onUnauthorized: () => void = () => {};

export const setupApi = (
  getTokenFn: () => string | null,
  onUnauthorizedFn: () => void,
) => {
  getToken = getTokenFn;
  onUnauthorized = onUnauthorizedFn;
};

const getTokenFromStore = () => {
  return getToken();
};

const handleUnauthorized = () => {
  onUnauthorized();
};

const adapter =
  typeof window !== "undefined" && typeof window.api !== "undefined"
    ? ipcAdapter
    : undefined;

export const api = createApiClient(
  toastService,
  getTokenFromStore,
  handleUnauthorized,
  adapter,
);
