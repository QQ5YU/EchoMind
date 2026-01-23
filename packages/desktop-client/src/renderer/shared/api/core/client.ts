import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export const createAxiosInstance = (
  config?: AxiosRequestConfig,
): AxiosInstance => {
  return axios.create({
    headers: {
      "Content-Type": "application/json",
    },
    ...config,
  });
};
