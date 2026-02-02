const SuccessMessage = ({ message, onClose, autoClose = true, duration = 3000 }) => {
    if (!message) return null;

    // Auto close after duration
    if (autoClose && onClose) {
        setTimeout(() => {
            onClose();
        }, duration);
    }

    return (
        <div className="message message-success" role="alert">
            <div className="message-content">
                <span className="message-icon">✅</span>
                <span className="message-text">{message}</span>
            </div>
            {onClose && (
                <button onClick={onClose} className="message-close" aria-label="Close">
                    ✕
                </button>
            )}
        </div>
    );
};

export default SuccessMessage;
