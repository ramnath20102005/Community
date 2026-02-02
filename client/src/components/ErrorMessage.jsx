const ErrorMessage = ({ message, onClose, type = "error" }) => {
    if (!message) return null;

    const typeClasses = {
        error: "message-error",
        warning: "message-warning",
        info: "message-info",
    };

    return (
        <div className={`message ${typeClasses[type]}`} role="alert">
            <div className="message-content">
                <span className="message-icon">
                    {type === "error" && "❌"}
                    {type === "warning" && "⚠️"}
                    {type === "info" && "ℹ️"}
                </span>
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

export default ErrorMessage;
