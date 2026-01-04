import axios from 'axios';
import { API_CONFIG } from '../utils/constants';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        // You can add auth tokens here if needed
        // config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle errors globally
        if (error.response) {
            // Server responded with error status
            console.error('API Error:', error.response.data);
        } else if (error.request) {
            // Request made but no response
            console.error('Network Error:', error.request);
        } else {
            // Something else happened
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

/**
 * Check API health status
 * @returns {Promise<Object>} Health status response
 */
export const checkHealth = async () => {
    try {
        const response = await apiClient.get('/health');
        return response.data;
    } catch (error) {
        throw new Error('Unable to connect to the server');
    }
};

/**
 * Send a chat message to the API
 * @param {string} query - User's query
 * @returns {Promise<Object>} Chat response with answer and sources
 */
export const sendChatMessage = async (query) => {
    try {
        const response = await apiClient.post('/chat', { query });
        return response.data;
    } catch (error) {
        if (error.response) {
            // Server error
            throw new Error(error.response.data.detail || 'Server error occurred');
        } else if (error.request) {
            // Network error
            throw new Error('Unable to connect to the server. Please check if the backend is running.');
        } else {
            // Other errors
            throw new Error('An unexpected error occurred');
        }
    }
};

/**
 * Retry a failed request
 * @param {Function} fn - Function to retry
 * @param {number} retries - Number of retry attempts
 * @param {number} delay - Delay between retries in ms
 * @returns {Promise<any>} Result of the function
 */
export const retryRequest = async (fn, retries = API_CONFIG.RETRY_ATTEMPTS, delay = API_CONFIG.RETRY_DELAY) => {
    try {
        return await fn();
    } catch (error) {
        if (retries <= 0) {
            throw error;
        }
        await new Promise(resolve => setTimeout(resolve, delay));
        return retryRequest(fn, retries - 1, delay * 2);
    }
};

export default apiClient;
