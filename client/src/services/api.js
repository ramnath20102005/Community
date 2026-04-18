import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://13.60.163.36:5000";

console.log(" API Configuration:", {
  API_BASE_URL,
  envVar: import.meta.env.VITE_API_URL,
  baseURL: `${API_BASE_URL}/api`,
  timestamp: new Date().toISOString()
});

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
    (config) => {
        console.log(" outgoing request:", {
            method: config.method?.toUpperCase(),
            url: config.url,
            baseURL: config.baseURL,
            fullURL: `${config.baseURL}${config.url}`,
            timestamp: new Date().toISOString()
        });

        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error(" request interceptor error:", error);
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
    (response) => {
        console.log(" response received:", {
            status: response.status,
            url: response.config.url,
            method: response.config.method?.toUpperCase(),
            timestamp: new Date().toISOString()
        });
        return response;
    },
    (error) => {
        console.error(" response error:", {
            status: error.response?.status,
            url: error.config?.url,
            method: error.config?.method?.toUpperCase(),
            message: error.message,
            data: error.response?.data,
            timestamp: new Date().toISOString()
        });

        if (error.response && error.response.status === 401) {
            // Unauthorized - clear user data
            console.log(" Unauthorized - clearing auth data");
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Optional: window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
