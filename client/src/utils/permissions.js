/**
 * Permission definitions for different actions
 * Using a flat constant for all possible actions in the system
 */
export const ACTIONS = {
    // Basic interaction
    VIEW_CONTENT: "VIEW_CONTENT",
    INTERACT: "INTERACT", // Like, Comment

    // Student Editor / Club Member actions
    CREATE_CLUB_POST: "CREATE_CLUB_POST",
    MANAGE_CLUB_POSTS: "MANAGE_CLUB_POSTS",

    // Alumni actions
    CREATE_JOB: "CREATE_JOB",
    POST_RESOURCE: "POST_RESOURCE",

    // Admin actions
    APPROVE_CLUB_MEMBER: "APPROVE_CLUB_MEMBER",
    MANAGE_USERS: "MANAGE_USERS",
    MODERATE_CONTENT: "MODERATE_CONTENT",
    ACCESS_ADMIN_PANEL: "ACCESS_ADMIN_PANEL"
};

/**
 * Backward Compatibility Mapping
 * Maps old PERMISSIONS keys to new ACTIONS
 */
export const PERMISSIONS = {
    CREATE_EVENT: ACTIONS.CREATE_CLUB_POST,
    CREATE_JOB: ACTIONS.CREATE_JOB,
    VIEW_EVENTS: ACTIONS.VIEW_CONTENT,
    VIEW_JOBS: ACTIONS.VIEW_CONTENT
};

/**
 * Calculates permissions based on role and club status
 * @param {Object} user - Use user object to determine full permission set
 * @returns {Array} - List of strings representing allowed actions
 */
export const calculatePermissions = (user) => {
    if (!user) return [];

    const permissions = new Set();

    // 1. Everyone gets basic viewing and interaction
    permissions.add(ACTIONS.VIEW_CONTENT);
    permissions.add(ACTIONS.INTERACT);

    // 2. Role-based additions
    const role = user.role?.toUpperCase() || "STUDENT";

    if (role === "ADMIN") {
        Object.values(ACTIONS).forEach(action => permissions.add(action));
        return Array.from(permissions);
    }

    if (role === "ALUMNI") {
        permissions.add(ACTIONS.CREATE_JOB);
        permissions.add(ACTIONS.POST_RESOURCE);
    }

    // 3. Sub-role logic: Club Member (Specific to Students)
    // Directly based on isClubMember flag set by Admin
    if (user.isClubMember) {
        permissions.add(ACTIONS.CREATE_CLUB_POST);
    }

    // Backward compatibility for the demo profiles (rahul/priya)
    if (user.role === "STUDENT_EDITOR") {
        permissions.add(ACTIONS.CREATE_CLUB_POST);
    }

    return Array.from(permissions);
};
