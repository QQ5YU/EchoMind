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
