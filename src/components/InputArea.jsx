import React, { useState, useRef, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import './InputArea.css';

const InputArea = ({ onSendMessage, isLoading }) => {
    const [message, setMessage] = useState('');
    const textareaRef = useRef(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [message]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && !isLoading) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form className="input-area" onSubmit={handleSubmit}>
            <div className="input-container glass-card">
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything about employees or HR policies..."
                    disabled={isLoading}
                    rows={1}
                    className="message-input"
                />
                <button
                    type="submit"
                    className="send-button"
                    disabled={!message.trim() || isLoading}
                    aria-label="Send message"
                >
                    <FiSend />
                </button>
            </div>
        </form>
    );
};

export default InputArea;
