import axios from 'axios';

// Create an Axios instance
export const api = axios.create({
  baseURL: 'http://localhost:3000', // Backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
  (config) => {
    const state = localStorage.getItem('auth-storage');
    if (state) {
        const { state: { token } } = JSON.parse(state);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors (e.g., 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., redirect to login)
      // We can't directly use hooks here, but we can clear storage
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
