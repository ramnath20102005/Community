import { useState, useEffect } from "react";

/**
 * NotificationToast Component
 * Displays real-time notifications triggered by socket events
 * Non-blocking UI feedback with auto-dismiss
 */
const NotificationToast = ({ message, type = "info", duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                if (onClose) {
                    setTimeout(onClose, 300); // Wait for fade-out animation
                }
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    if (!isVisible) return null;

    const typeIcons = {
        success: "✅",
        error: "❌",
        warning: "⚠️",
        info: "ℹ️",
        event: "📅",
        job: "💼",
    };

    return (
        <div className={`notification-toast notification-${type} ${isVisible ? "visible" : "hidden"}`}>
            <span className="toast-icon">{typeIcons[type] || "📢"}</span>
            <span className="toast-message">{message}</span>
            {onClose && (
                <button onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300);
                }} className="toast-close">
                    ✕
                </button>
            )}
        </div>
    );
};

/**
 * ToastContainer Component
 * Manages multiple toast notifications
 */
export const ToastContainer = ({ toasts = [], removeToast }) => {
    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <NotificationToast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};

export default NotificationToast;
