import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useRole } from "../hooks/useRole";
import Loader from "../components/Loader";

const RoleRoute = ({ allowedRoles = [] }) => {
    const { user, loading: authLoading } = useAuth();
    const { hasRole, loading: roleLoading } = useRole();

    if (authLoading || roleLoading) {
        return <Loader />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default RoleRoute;
