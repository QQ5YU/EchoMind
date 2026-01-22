import { Key } from "path-to-regexp";

export interface IpcRequest {
  url: string;
  method: string;
  data?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, unknown>;
}

export interface RouteHandler {
  target: Record<string, unknown>;
  methodName: string;
  httpMethod: string;
  regex: RegExp;
  keys: Key[];
  paramMetadata?: Record<string, { data?: string }>;
}

export type RouteParams = Record<string, string>;

export enum RouteParamtypes {
  REQUEST = 0,
  RESPONSE = 1,
  NEXT = 2,
  BODY = 3,
  QUERY = 4,
  PARAM = 5,
  HEADERS = 6,
  SESSION = 7,
  FILE = 8,
  FILES = 9,
  IP = 10,
}
