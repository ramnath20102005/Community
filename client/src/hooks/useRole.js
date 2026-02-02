import { useContext } from "react";
import { RoleContext } from "../context/RoleContext";

export const useRole = () => {
    const context = useContext(RoleContext);

    if (!context) {
        throw new Error("useRole must be used within a RoleProvider");
    }

    const hasRole = (allowedRoles) => {
        if (!context.role) return false;

        const currentRole = context.role.toUpperCase();

        if (Array.isArray(allowedRoles)) {
            return allowedRoles.some(r => r.toUpperCase() === currentRole);
        }
        return currentRole === allowedRoles.toUpperCase();
    };

    return {
        ...context,
        hasRole,
    };
};
