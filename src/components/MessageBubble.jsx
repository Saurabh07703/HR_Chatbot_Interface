import React from 'react';
import { formatTime, parseMessageContent } from '../utils/helpers';
import EmployeeCard from './EmployeeCard';
import PolicyCard from './PolicyCard';
import './MessageBubble.css';

const MessageBubble = ({ message }) => {
    const { role, content, timestamp, employees, sources } = message;
    const isUser = role === 'user';

    return (
        <div className={`message-wrapper ${isUser ? 'user-message' : 'assistant-message'}`}>
            <div className={`message-bubble ${isUser ? 'user-bubble' : 'assistant-bubble'}`}>
                {!isUser && (
                    <div className="message-avatar">
                        <span>🤖</span>
                    </div>
                )}

                <div className="message-content-wrapper">
                    <div
                        className="message-text"
                        dangerouslySetInnerHTML={{ __html: parseMessageContent(content) }}
                    />

                    {/* Display employee cards if present */}
                    {employees && employees.length > 0 && (
                        <div className="employees-list">
                            {employees.map((employee, index) => (
                                <EmployeeCard key={index} employee={employee} />
                            ))}
                        </div>
                    )}

                    {/* Display source citations if present */}
                    {sources && sources.length > 0 && (
                        <div className="sources-list">
                            {sources.map((source, index) => (
                                <PolicyCard key={index} source={source} />
                            ))}
                        </div>
                    )}

                    <span className="message-time">{formatTime(timestamp)}</span>
                </div>

                {isUser && (
                    <div className="message-avatar user-avatar">
                        <span>👤</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageBubble;
