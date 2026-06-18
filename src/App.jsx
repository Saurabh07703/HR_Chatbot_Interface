import React, { useState, useEffect, useRef } from 'react';
import ChatInterface from './components/ChatInterface';
import InputArea from './components/InputArea';
import Sidebar from './components/Sidebar';
import { checkHealth, streamChatMessage, getSessions, getSession, deleteSession } from './services/api';
import { generateId } from './utils/helpers';
import { UI_TEXT, ERROR_MESSAGES } from './utils/constants';
import { FiAlertCircle } from 'react-icons/fi';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isBackendOnline, setIsBackendOnline] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  // Check backend health on mount
  useEffect(() => {
    const initData = async () => {
      try {
        await checkHealth();
        setIsBackendOnline(true);
        fetchSessions();
      } catch (err) {
        setIsBackendOnline(false);
        console.error('Backend health check failed:', err);
      }
    };

    initData();
  }, []);

  const fetchSessions = async () => {
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    }
  };

  const handleSelectSession = async (sessionId) => {
    setCurrentSessionId(sessionId);
    setIsLoading(true);
    try {
      const session = await getSession(sessionId);
      if (session && session.messages) {
        const formattedMessages = session.messages.map(m => ({
          id: generateId(),
          role: m.role,
          content: m.content,
          timestamp: m.timestamp
        }));
        setMessages(formattedMessages);
      }
    } catch (err) {
      console.error('Failed to fetch session messages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSession = () => {
    setCurrentSessionId(null);
    setMessages([]);
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      await deleteSession(sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (currentSessionId === sessionId) {
        handleNewSession();
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  const handleSendMessage = async (messageText) => {
    setError(null);

    const userMessage = {
      id: generateId(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const assistantMessageId = generateId();
    let currentAssistantMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      employees: null,
      sources: null
    };

    setMessages(prev => [...prev, currentAssistantMessage]);

    await streamChatMessage(
      messageText,
      currentSessionId,
      (data) => {
        setIsLoading(false); // Once streaming starts, stop loading indicator
        
        setMessages(prev => {
          const newMessages = [...prev];
          const targetIndex = newMessages.findIndex(m => m.id === assistantMessageId);
          if (targetIndex !== -1) {
            const currentMsg = { ...newMessages[targetIndex] };
            
            if (data.type === 'chunk') {
              currentMsg.content += data.data;
            } else if (data.type === 'sources') {
              currentMsg.sources = data.data;
            } else if (data.type === 'employees') {
              currentMsg.employees = data.data;
            }
            
            newMessages[targetIndex] = currentMsg;
          }
          return newMessages;
        });
      },
      (err) => {
        console.error('Error in stream:', err);
        setError(err.message || ERROR_MESSAGES.SERVER_ERROR);
        setIsLoading(false);
      }
    );
    
    // Refresh sessions to get updated titles
    fetchSessions();
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

      <div className="app-body">
        <Sidebar 
          sessions={sessions} 
          currentSessionId={currentSessionId} 
          onSelectSession={handleSelectSession} 
          onNewSession={handleNewSession} 
          onDeleteSession={handleDeleteSession} 
        />
        <div className="main-content">
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
      </div>
    </div>
  );
}

export default App;
