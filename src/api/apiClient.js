import axios from 'axios';

// Determine API URL based on environment
const getApiUrl = () => {
  // Check if we're running on Vercel or production
  if (typeof window !== 'undefined' && (
    window.location.hostname.includes('vercel.app') || 
    window.location.hostname.includes('playd.app') ||
    import.meta.env.PROD
  )) {
    return '/api'; // Relative path for production/Vercel
  }
  // If running locally, use localhost backend
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

// Create axios instance with base configuration
const baseURL = getApiUrl();
console.log('🔧 API Base URL:', baseURL);
console.log('🌍 Environment:', {
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
  prod: import.meta.env.PROD,
  mode: import.meta.env.MODE
});

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;