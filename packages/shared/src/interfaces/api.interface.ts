export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  errorCode: string;
  timestamp: string;
  path: string;
  method: string;
  details?: unknown;
}

export interface ApiSuccessResponse<T = unknown> {
  data: T;
  status: number;
  statusText?: string;
  headers?: Record<string, string>;
}

export interface ApiFailureResponse {
  error: true;
  data: ApiErrorResponse;
  status: number;
  statusText?: string;
  headers?: Record<string, string>;
}

export type ApiResponse<T = unknown> =
  | ApiSuccessResponse<T>
  | ApiFailureResponse;
