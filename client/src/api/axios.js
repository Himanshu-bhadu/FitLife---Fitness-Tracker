import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // --- FIX START ---
    // If the error comes from checking the user profile, DO NOT reload.
    // Just let the LoginPage handle the error (by showing the login form).
    if (error.response?.status === 401 && originalRequest.url.includes('/api/user/me')) {
      return Promise.reject(error);
    }
    // --- FIX END ---

    if (error.response?.status === 401) {
      sessionStorage.clear();
      // Only redirect if we aren't already on the login page to avoid loops
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;