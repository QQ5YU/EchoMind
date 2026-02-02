export interface ErrorLogContext {
  method: string;
  path: string;
  message: string | string[];
  stack?: string;
}
