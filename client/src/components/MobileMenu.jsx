import { Link } from "react-router-dom";
import { useRole } from "../hooks/useRole";

const MobileMenu = ({ isOpen, onClose }) => {
    const { role } = useRole();

    const menuItems = [
        { path: "/dashboard", label: "Dashboard", roles: ["student", "alumni", "admin"] },
        { path: "/events", label: "Events", roles: ["student", "alumni", "admin"] },
        { path: "/jobs", label: "Jobs", roles: ["student", "alumni", "admin"] },
        { path: "/profile", label: "Profile", roles: ["student", "alumni", "admin"] },
    ];

    if (role === "admin") {
        menuItems.push({ path: "/admin", label: "Admin Panel", roles: ["admin"] });
    }

    if (!isOpen) return null;

    return (
        <>
            <div className="mobile-menu-overlay" onClick={onClose} />
            <div className="mobile-menu">
                <div className="mobile-menu-header">
                    <h3>Menu</h3>
                    <button onClick={onClose} className="close-btn">
                        ✕
                    </button>
                </div>
                <nav className="mobile-menu-nav">
                    {menuItems
                        .filter((item) => item.roles.includes(role))
                        .map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="mobile-menu-item"
                                onClick={onClose}
                            >
                                {item.label}
                            </Link>
                        ))}
                </nav>
            </div>
        </>
    );
};

export default MobileMenu;
