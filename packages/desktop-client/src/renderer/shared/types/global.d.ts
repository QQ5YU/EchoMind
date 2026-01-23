import type { ApiRequest, ApiResponse } from "../api/types";

export type IpcInvoke = <Req = unknown, Res = unknown | ApiResponse<any>>(
  channel: string,
  data?: Req,
) => Promise<Res>;
export type IpcSend = (channel: string, data?: unknown) => void;
export type IpcOn = (
  channel: string,
  callback: (...args: unknown[]) => void,
) => void;

export interface IpcApi {
  invoke: IpcInvoke;
  send: IpcSend;
  on: IpcOn;
}

declare global {
  interface Window {
    electron?: unknown;
    api?: IpcApi;
  }
}

export {};
