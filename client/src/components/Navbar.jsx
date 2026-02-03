import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useRole } from "../hooks/useRole";
import { getRoleDisplayName } from "../utils/roleDetector";
import { Menu, LogOut } from "lucide-react";
import './comp_css/Navbar.css';

const Navbar = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const { role } = useRole();

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-left">
                    <button className="menu-toggle" onClick={onMenuClick}>
                        <Menu size={24} />
                    </button>
                    <Link to="/" className="navbar-brand">
                        <div className="navbar-logo">K</div>
                        <h3>Kongu Community</h3>
                    </Link>
                </div>

                <div className="navbar-right">
                    {user && (
                        <>
                            <div className="navbar-user">
                                <span className="navbar-user-name">{user.name}</span>
                                <span className="navbar-user-role">{getRoleDisplayName(role)}</span>
                            </div>
                            <button onClick={logout} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 24px' }}>
                                <LogOut size={16} />
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
