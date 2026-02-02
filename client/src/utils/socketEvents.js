/**
 * WebSocket Event Constants
 * Central place for all socket event names to prevent string duplication
 */

// Event-related socket events
export const EVENT_CREATED = "event:created";
export const EVENT_UPDATED = "event:updated";
export const EVENT_DELETED = "event:deleted";
export const EVENT_LIST = "event:list";

// Job-related socket events
export const JOB_CREATED = "job:created";
export const JOB_UPDATED = "job:updated";
export const JOB_DELETED = "job:deleted";
export const JOB_LIST = "job:list";

// User-related socket events
export const USER_JOINED = "user:joined";
export const USER_LEFT = "user:left";
export const USER_UPDATED = "user:updated";

// Notification events
export const NOTIFICATION_NEW = "notification:new";
export const NOTIFICATION_READ = "notification:read";

// Connection events
export const CONNECT = "connect";
export const DISCONNECT = "disconnect";
export const ERROR = "error";
export const RECONNECT = "reconnect";

// Admin moderation events
export const MODERATION_UPDATE = "moderation:update";
export const CONTENT_APPROVED = "content:approved";
export const CONTENT_REJECTED = "content:rejected";

/**
 * Create a socket message payload
 * @param {string} type - Event type
 * @param {object} data - Event data
 * @returns {object} Formatted message
 */
export const createSocketMessage = (type, data) => ({
    type,
    data,
    timestamp: new Date().toISOString(),
});
