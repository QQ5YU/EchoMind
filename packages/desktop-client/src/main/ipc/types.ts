import { Key } from 'path-to-regexp';

/**
 * IPC request structure from the renderer
 */
export interface IpcRequest {
  url: string;
  method: string;
  data?: any;
  params?: any;
  headers?: any;
}

/**
 * Internal structure for route handlers
 */
export interface RouteHandler {
  target: any;
  methodName: string;
  httpMethod: string;
  regex: RegExp;
  keys: Key[];
  paramMetadata: any;
}

/**
 * NestJS internal parameter type enumeration
 */
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