import React from 'react';
import { FiMessageSquare, FiPlus, FiTrash2 } from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = ({ sessions, currentSessionId, onSelectSession, onNewSession, onDeleteSession }) => {
  return (
    <div className="sidebar glass-card">
      <div className="sidebar-header">
        <button className="new-chat-btn" onClick={onNewSession}>
          <FiPlus />
          <span>New Chat</span>
        </button>
      </div>
      
      <div className="sidebar-sessions">
        <h3 className="sessions-title">Recent Chats</h3>
        {sessions.length === 0 ? (
          <div className="no-sessions">No previous chats</div>
        ) : (
          <ul className="sessions-list">
            {sessions.map((session) => (
              <li 
                key={session.id} 
                className={`session-item ${currentSessionId === session.id ? 'active' : ''}`}
                onClick={() => onSelectSession(session.id)}
              >
                <FiMessageSquare className="session-icon" />
                <span className="session-title" title={session.title}>
                  {session.title || 'New Chat'}
                </span>
                <button 
                  className="delete-session-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  title="Delete Chat"
                >
                  <FiTrash2 />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
