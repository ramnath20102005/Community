import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useRole } from "../hooks/useRole";
import { getRoleDisplayName } from "../utils/roleDetector";
import './comp_css/Navbar.css';

const Navbar = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const { role } = useRole();

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-left">
                    <button className="menu-toggle" onClick={onMenuClick}>
                        ☰
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
                            <button onClick={logout} className="btn btn-outline" style={{ padding: '8px 24px' }}>
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
