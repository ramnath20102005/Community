import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "../hooks/useAuth";
import { detectUserRole } from "../utils/roleDetector";
import { calculatePermissions } from "../utils/permissions";

export const RoleContext = createContext(null);

/**
 * RoleProvider - Manages user permissions and sub-roles
 * Transitions the app from Role-Based (RBAC) to Permission-Based (PBAC) checks.
 */
const RoleProvider = ({ children }) => {
    const { user, loading: authLoading } = useAuth();

    // Initialize state immediately if user is already available (reload case)
    const [role, setRole] = useState(() => user ? detectUserRole(user) : null);
    const [permissions, setPermissions] = useState(() => user ? calculatePermissions(user) : []);
    const [roleLoading, setRoleLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const detectedRole = detectUserRole(user);
            setRole(detectedRole);
            const calculated = calculatePermissions(user);
            setPermissions(calculated);
            setRoleLoading(false);
        } else if (!authLoading) {
            setRole(null);
            setPermissions([]);
            setRoleLoading(false);
        }
    }, [user, authLoading]);

    /**
     * Check if current user can perform an action
     * @param {string} action - Action from ACTIONS constant
     * @returns {boolean}
     */
    const can = (action) => {
        return permissions.includes(action);
    };

    /**
     * Legacy check for role-specific routes
     * @param {string|Array} allowedRoles 
     * @returns {boolean}
     */
    const hasRole = (allowedRoles) => {
        if (!role) return false;
        if (Array.isArray(allowedRoles)) {
            return allowedRoles.includes(role);
        }
        return role === allowedRoles;
    };

    return (
        <RoleContext.Provider value={{ role, permissions, can, hasPermission: can, hasRole, loading: roleLoading }}>
            {children}
        </RoleContext.Provider>
    );
};

export default RoleProvider;
