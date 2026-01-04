import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import InputArea from './components/InputArea';
import { sendChatMessage, checkHealth } from './services/api';
import { generateId } from './utils/helpers';
import { UI_TEXT, ERROR_MESSAGES } from './utils/constants';
import { FiAlertCircle } from 'react-icons/fi';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isBackendOnline, setIsBackendOnline] = useState(null);

  // Check backend health on mount
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        await checkHealth();
        setIsBackendOnline(true);
      } catch (err) {
        setIsBackendOnline(false);
        console.error('Backend health check failed:', err);
      }
    };

    checkBackendHealth();
  }, []);

  const handleSendMessage = async (messageText) => {
    // Clear any previous errors
    setError(null);

    // Add user message
    const userMessage = {
      id: generateId(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Send message to API
      const response = await sendChatMessage(messageText);

      // Parse response to check if it contains employee data
      let employees = null;
      let sources = null;

      // Check if the answer contains employee information
      // The backend returns employee data in the answer field
      if (response.answer && typeof response.answer === 'string') {
        // Try to parse if it's JSON (employee search results)
        try {
          const parsed = JSON.parse(response.answer);
          if (Array.isArray(parsed)) {
            employees = parsed;
          }
        } catch {
          // Not JSON, it's a regular text answer
        }
      }

      // Get sources if available
      if (response.sources && response.sources.length > 0) {
        sources = response.sources;
      }

      // Create assistant message
      const assistantMessage = {
        id: generateId(),
        role: 'assistant',
        content: employees
          ? `I found ${employees.length} employee${employees.length !== 1 ? 's' : ''} matching your criteria:`
          : response.answer,
        timestamp: new Date(),
        employees: employees,
        sources: sources,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message || ERROR_MESSAGES.SERVER_ERROR);

      // Add error message to chat
      const errorMessage = {
        id: generateId(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${err.message || ERROR_MESSAGES.SERVER_ERROR}`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header glass-card">
        <div className="header-content">
          <div className="header-left">
            <div className="app-logo">🤖</div>
            <div className="header-text">
              <h1 className="app-title gradient-text">{UI_TEXT.APP_TITLE}</h1>
              <p className="app-subtitle">{UI_TEXT.APP_SUBTITLE}</p>
            </div>
          </div>
          <div className="header-right">
            <div className={`status-indicator ${isBackendOnline ? 'online' : 'offline'}`}>
              <span className="status-dot"></span>
              <span className="status-text">
                {isBackendOnline === null ? 'Checking...' : isBackendOnline ? 'Connected' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Backend Offline Warning */}
      {isBackendOnline === false && (
        <div className="warning-banner">
          <FiAlertCircle />
          <span>
            Unable to connect to the backend. Please ensure the FastAPI server is running on{' '}
            <code>{import.meta.env.VITE_API_URL || 'http://localhost:8000'}</code>
          </span>
        </div>
      )}

      {/* Main Chat Area */}
      <main className="app-main">
        <ChatInterface messages={messages} isLoading={isLoading} />
      </main>

      {/* Input Area */}
      <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}

export default App;
