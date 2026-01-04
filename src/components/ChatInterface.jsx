import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import LoadingIndicator from './LoadingIndicator';
import { SAMPLE_QUERIES } from '../utils/constants';
import './ChatInterface.css';

const ChatInterface = ({ messages, isLoading }) => {
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    return (
        <div className="chat-interface">
            {messages.length === 0 ? (
                <div className="welcome-screen">
                    <div className="welcome-content">
                        <div className="welcome-icon">🤖</div>
                        <h1 className="welcome-title gradient-text">Welcome to HR Assistant!</h1>
                        <p className="welcome-message">
                            I can help you with two things:
                        </p>
                        <div className="features-list">
                            <div className="feature-item glass-card">
                                <span className="feature-icon">🔍</span>
                                <div>
                                    <h3>Find Employees</h3>
                                    <p>Search for employees based on skills and experience</p>
                                </div>
                            </div>
                            <div className="feature-item glass-card">
                                <span className="feature-icon">📚</span>
                                <div>
                                    <h3>HR Policies</h3>
                                    <p>Get answers to questions about company policies</p>
                                </div>
                            </div>
                        </div>
                        <div className="sample-queries">
                            <p className="sample-title">Try asking:</p>
                            <div className="queries-grid">
                                {SAMPLE_QUERIES.map((query, index) => (
                                    <div key={index} className="query-chip">
                                        {query}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="messages-container">
                    {messages.map((message, index) => (
                        <MessageBubble key={index} message={message} />
                    ))}
                    {isLoading && <LoadingIndicator />}
                    <div ref={messagesEndRef} />
                </div>
            )}
        </div>
    );
};

export default ChatInterface;
