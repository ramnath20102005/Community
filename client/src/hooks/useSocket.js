import { useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";

/**
 * useSocket Hook
 * Clean abstraction over SocketContext
 * Keeps components socket-agnostic
 */
export const useSocket = () => {
    const context = useContext(SocketContext);

    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }

    return context;
};

/**
 * useSocketEvent Hook
 * Subscribe to specific socket event with automatic cleanup
 * @param {string} eventType - Event type to listen for
 * @param {function} callback - Callback function
 */
export const useSocketEvent = (eventType, callback) => {
    const { subscribe } = useSocket();

    useEffect(() => {
        const unsubscribe = subscribe(eventType, callback);
        return unsubscribe;
    }, [eventType, callback, subscribe]);
};

export default useSocket;
