import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Global Response Interceptor
api.interceptors.response.use(
  (response) => {
    // Passes through successful responses (2xx status codes)
    return response;
  },
  (error) => {
    // Intercepts errors before they reach your React components
    if (error.response) {
      const status = error.response.status;

      // 401 Unauthorized: Token is missing, invalid, or expired.
      // 403 Forbidden: Token is valid, but the user lacks the required role (e.g., trying to hit /admin).
      if (status === 401 || status === 403) {
        
        // Using window.location.href performs a hard redirect.
        // This is preferred for auth failures as it completely clears the SPA memory state,
        // ensuring no sensitive user data remains in memory.
        window.location.href = '/login';
      }
    }
    
    // Reject the promise so the specific component can still handle the error if needed
    return Promise.reject(error);
  }
);

export default api;