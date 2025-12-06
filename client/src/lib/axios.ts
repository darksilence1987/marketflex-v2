import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch {
        // Invalid JSON in localStorage
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only clear auth on 401 if there was a token sent (actual auth failure)
    // Don't trigger redirect - let components handle auth state
    if (error.response?.status === 401 && error.config?.headers?.Authorization) {
      localStorage.removeItem('auth-storage');
      // Reload to reflect logged out state (only if auth was actually attempted)
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default api;
