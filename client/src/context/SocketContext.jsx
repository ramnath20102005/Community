import { createContext, useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { CONNECT, DISCONNECT, ERROR } from "../utils/socketEvents";

export const SocketContext = createContext(null);

/**
 * SocketProvider - Manages WebSocket connection lifecycle
 * For now, simulates WebSocket behavior for demo purposes
 * Ready to be replaced with real WebSocket connection
 */
const SocketProvider = ({ children }) => {
    const { user } = useAuth();
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const listenersRef = useRef(new Map());
    const socketRef = useRef(null);

    /**
     * Simulate WebSocket connection
     * In production, replace with: new WebSocket('ws://your-backend-url')
     */
    const connect = useCallback(() => {
        if (!user || socketRef.current) return;

        console.log("[WebSocket] Connecting...");

        // Simulate connection delay
        setTimeout(() => {
            socketRef.current = {
                connected: true,
                send: (message) => {
                    console.log("[WebSocket] Sending:", message);
                    // Simulate server echo for demo
                    setTimeout(() => {
                        const parsed = JSON.parse(message);
                        broadcast(parsed.type, parsed.data);
                    }, 100);
                },
                close: () => {
                    console.log("[WebSocket] Closing connection");
                    socketRef.current = null;
                    setIsConnected(false);
                },
            };

            setIsConnected(true);
            setError(null);
            console.log("[WebSocket] Connected");

            // Notify listeners
            broadcast(CONNECT, { userId: user.id });
        }, 500);
    }, [user]);

    /**
     * Disconnect WebSocket
     */
    const disconnect = useCallback(() => {
        if (socketRef.current) {
            broadcast(DISCONNECT, { userId: user?.id });
            socketRef.current.close();
            socketRef.current = null;
            setIsConnected(false);
        }
    }, [user]);

    /**
     * Send message through WebSocket
     * @param {string} type - Event type
     * @param {object} payload - Event data
     */
    const sendMessage = useCallback((type, payload) => {
        if (!socketRef.current || !isConnected) {
            console.warn("[WebSocket] Not connected. Message not sent:", type);
            return;
        }

        const message = JSON.stringify({
            type,
            data: payload,
            timestamp: new Date().toISOString(),
        });

        socketRef.current.send(message);
    }, [isConnected]);

    /**
     * Subscribe to specific event type
     * @param {string} eventType - Event type to listen for
     * @param {function} callback - Function to call when event occurs
     * @returns {function} Unsubscribe function
     */
    const subscribe = useCallback((eventType, callback) => {
        if (!listenersRef.current.has(eventType)) {
            listenersRef.current.set(eventType, new Set());
        }

        listenersRef.current.get(eventType).add(callback);

        // Return unsubscribe function
        return () => {
            const listeners = listenersRef.current.get(eventType);
            if (listeners) {
                listeners.delete(callback);
            }
        };
    }, []);

    /**
     * Broadcast event to all subscribers
     * @param {string} eventType - Event type
     * @param {object} data - Event data
     */
    const broadcast = useCallback((eventType, data) => {
        const listeners = listenersRef.current.get(eventType);
        if (listeners) {
            listeners.forEach((callback) => {
                try {
                    callback(data);
                } catch (err) {
                    console.error("[WebSocket] Listener error:", err);
                }
            });
        }
    }, []);

    /**
     * Simulate incoming server messages (for demo)
     * In production, this would be handled by actual WebSocket onmessage
     */
    const simulateServerMessage = useCallback((type, data) => {
        broadcast(type, data);
    }, [broadcast]);

    // Connect when user logs in
    useEffect(() => {
        if (user) {
            connect();
        } else {
            disconnect();
        }

        return () => {
            disconnect();
        };
    }, [user, connect, disconnect]);

    // Handle connection errors (simulated)
    useEffect(() => {
        if (error) {
            console.error("[WebSocket] Error:", error);
        }
    }, [error]);

    const value = {
        isConnected,
        error,
        sendMessage,
        subscribe,
        simulateServerMessage, // For demo purposes
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
