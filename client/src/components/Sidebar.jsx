import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useRole } from "../hooks/useRole";
import { useAuth } from "../hooks/useAuth";
import GuidelinesModal from "./GuidelinesModal";
import { 
    Layout, 
    BarChart3, 
    ShieldCheck, 
    CalendarPlus, 
    Briefcase, 
    Users, 
    UserCircle,
    BookText
} from "lucide-react";
import './comp_css/Sidebar.css';

const Sidebar = () => {
    const { role } = useRole();
    const { user } = useAuth();
    const [showGuidelines, setShowGuidelines] = useState(false);

    const menuItems = [
        { path: "/general", label: "General Hub", icon: <BookText size={18} />, roles: ["STUDENT", "STUDENT_EDITOR", "ALUMNI", "ADMIN"] },
        { path: "/student/dashboard", label: "Dashboard", icon: <BarChart3 size={18} />, roles: ["STUDENT", "STUDENT_EDITOR"] },
        { path: "/alumni/dashboard", label: "Dashboard", icon: <BarChart3 size={18} />, roles: ["ALUMNI"] },
        { path: "/admin/dashboard", label: "Admin Panel", icon: <ShieldCheck size={18} />, roles: ["ADMIN"] },
        { path: "/events/create", label: "Share Event", icon: <CalendarPlus size={18} />, roles: ["STUDENT_EDITOR", "ALUMNI", "ADMIN"] },
        { path: "/jobs/create", label: "Post Job", icon: <Briefcase size={18} />, roles: ["ALUMNI"] },
        { path: "/alumni-directory", label: "Alumni Network", icon: <Users size={18} />, roles: ["STUDENT", "STUDENT_EDITOR", "ALUMNI", "ADMIN"] },
        { path: "/profile", label: "My Profile", icon: <UserCircle size={18} />, roles: ["STUDENT", "STUDENT_EDITOR", "ALUMNI", "ADMIN"] },
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
                    <button className="btn sidebar-help-btn" onClick={() => setShowGuidelines(true)}>Guidelines</button>
                </div>
            )}
            
            <GuidelinesModal 
                isOpen={showGuidelines} 
                onClose={() => setShowGuidelines(false)} 
                role={role}
                userName={user?.name}
            />
        </aside>
    );
};

export default Sidebar;
