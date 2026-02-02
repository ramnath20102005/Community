import { NavLink } from "react-router-dom";
import { useRole } from "../hooks/useRole";
import './comp_css/Sidebar.css';

const Sidebar = () => {
    const { role } = useRole();

    const menuItems = [
        { path: "/student/dashboard", label: "Dashboard", icon: "📊", roles: ["STUDENT", "STUDENT_EDITOR"] },
        { path: "/alumni/dashboard", label: "Dashboard", icon: "📊", roles: ["ALUMNI"] },
        { path: "/admin/dashboard", label: "Admin Panel", icon: "🔐", roles: ["ADMIN"] },
        { path: "/events", label: "Campus Events", icon: "📅", roles: ["STUDENT", "STUDENT_EDITOR", "ALUMNI", "ADMIN"] },
        { path: "/events/create", label: "Share Event", icon: "✍️", roles: ["STUDENT_EDITOR", "ALUMNI", "ADMIN"] },
        { path: "/jobs", label: "Job Hub", icon: "💼", roles: ["STUDENT", "STUDENT_EDITOR", "ALUMNI", "ADMIN"] },
        { path: "/jobs/create", label: "Post Job", icon: "➕", roles: ["ALUMNI", "ADMIN"] },
        { path: "/alumni-directory", label: "Alumni Network", icon: "🌐", roles: ["STUDENT", "STUDENT_EDITOR", "ALUMNI", "ADMIN"] },
        { path: "/profile", label: "My Profile", icon: "👤", roles: ["STUDENT", "STUDENT_EDITOR", "ALUMNI", "ADMIN"] },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-section">
                <p className="sidebar-label">Main Navigation</p>
                {menuItems
                    .filter(item => !item.roles || item.roles.includes(role))
                    .map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
            </div>

            {role !== "ADMIN" && (
                <div className="sidebar-help">
                    <p className="sidebar-help-title">Need Help?</p>
                    <p className="sidebar-help-text">Check out our community guidelines.</p>
                    <button className="btn sidebar-help-btn">Guidelines</button>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
