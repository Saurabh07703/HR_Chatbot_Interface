export const SAMPLE_QUERIES = [
  "Find developers with 5 years of experience",
  "Show me data scientists with Python skills",
  "What is the vacation policy?",
  "Tell me about the remote work policy",
  "Find senior engineers with React experience"
];

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Unable to connect to the server. Please check your connection and try again.",
  SERVER_ERROR: "The server encountered an error. Please try again later.",
  INVALID_RESPONSE: "Received an invalid response from the server.",
  EMPTY_QUERY: "Please enter a message to send."
};

export const UI_TEXT = {
  APP_TITLE: "HR Assistant",
  APP_SUBTITLE: "Your intelligent HR companion",
  WELCOME_TITLE: "Welcome to HR Assistant! 👋",
  WELCOME_MESSAGE: "I can help you with two things:",
  WELCOME_FEATURE_1: "🔍 Find employees based on skills and experience",
  WELCOME_FEATURE_2: "📚 Answer questions about HR policies",
  PLACEHOLDER: "Ask me anything about employees or HR policies...",
  SEND_BUTTON: "Send",
  TYPING: "HR Assistant is typing",
  ERROR_TITLE: "Oops! Something went wrong",
  RETRY_BUTTON: "Try Again"
};

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};
