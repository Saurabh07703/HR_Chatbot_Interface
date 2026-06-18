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
 * Send a chat message and stream the response
 * @param {string} query - User's query
 * @param {string} sessionId - Optional session ID
 * @param {Function} onChunk - Callback for each stream chunk
 * @param {Function} onError - Callback for errors
 */
export const streamChatMessage = async (query, sessionId, onChunk, onError) => {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/chat/stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query, session_id: sessionId }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const dataStr = line.replace('data: ', '').trim();
                    if (dataStr === '[DONE]') {
                        return;
                    }
                    try {
                        const data = JSON.parse(dataStr);
                        onChunk(data);
                    } catch (e) {
                        console.error('Error parsing stream chunk:', e);
                    }
                }
            }
        }
    } catch (error) {
        onError(error);
    }
};

/**
 * Fetch all chat sessions
 * @returns {Promise<Array>} List of sessions
 */
export const getSessions = async () => {
    const response = await apiClient.get('/sessions');
    return response.data;
};

/**
 * Fetch a specific chat session with its messages
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} Session data
 */
export const getSession = async (sessionId) => {
    const response = await apiClient.get(`/sessions/${sessionId}`);
    return response.data;
};

/**
 * Delete a chat session
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} Status
 */
export const deleteSession = async (sessionId) => {
    const response = await apiClient.delete(`/sessions/${sessionId}`);
    return response.data;
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
