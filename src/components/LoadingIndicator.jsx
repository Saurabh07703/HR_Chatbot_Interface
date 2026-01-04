import React from 'react';
import './LoadingIndicator.css';

const LoadingIndicator = () => {
    return (
        <div className="loading-indicator">
            <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <span className="loading-text">HR Assistant is typing</span>
        </div>
    );
};

export default LoadingIndicator;
