import React from 'react';
import './PolicyCard.css';

const PolicyCard = ({ source }) => {
    return (
        <div className="policy-card glass-card">
            <div className="policy-header">
                <span className="policy-icon">📚</span>
                <h4 className="policy-title">Source Document</h4>
            </div>
            <p className="policy-source">{source}</p>
        </div>
    );
};

export default PolicyCard;
