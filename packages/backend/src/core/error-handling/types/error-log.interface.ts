export interface ErrorLogContext {
  method: string;
  path: string;
  message: string;
  stack?: string;
}
