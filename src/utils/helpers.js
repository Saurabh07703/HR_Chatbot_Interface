/**
 * Format a date to a readable time string
 * @param {Date} date - The date to format
 * @returns {string} Formatted time string (e.g., "2:30 PM")
 */
export const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).format(date);
};

/**
 * Truncate text to a specified length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
};

/**
 * Generate a random color for skill tags
 * @param {string} skill - The skill name
 * @returns {string} CSS gradient string
 */
export const getSkillColor = (skill) => {
    const colors = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    ];

    // Generate a consistent color based on skill name
    const hash = skill.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    return colors[Math.abs(hash) % colors.length];
};

/**
 * Parse message content for special formatting
 * @param {string} text - The message text
 * @returns {string} Formatted HTML string
 */
export const parseMessageContent = (text) => {
    if (!text) return '';

    // Convert markdown-style bold to HTML
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert line breaks to <br>
    formatted = formatted.replace(/\n/g, '<br>');

    return formatted;
};

/**
 * Debounce function to limit API calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Check if a string is a valid URL
 * @param {string} string - String to check
 * @returns {boolean} True if valid URL
 */
export const isValidUrl = (string) => {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
};

/**
 * Generate a unique ID
 * @returns {string} Unique ID string
 */
export const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
