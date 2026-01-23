import {
  ApiErrorResponse,
  ApiSuccessResponse,
  ApiFailureResponse,
  ApiResponse,
} from "@echomind/shared";

export type {
  ApiErrorResponse,
  ApiSuccessResponse,
  ApiFailureResponse,
  ApiResponse,
};

export interface ApiRequest {
  method?: string;
  url: string;
  data?: unknown;
  params?: unknown;
  headers?: Record<string, string>;
}