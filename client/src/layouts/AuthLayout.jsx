import { Outlet } from "react-router-dom";
import '../layouts/layout_css/AuthLayout.css';

/**
 * AuthLayout - Editorial Aesthetic
 * Paper-like background with minimal decoration
 */
const AuthLayout = () => {
  return (
    <div className="auth-layout">
      {/* Decorative corner elements */}
      <div className="auth-decoration auth-decoration-tl" />
      <div className="auth-decoration auth-decoration-br" />

      <div className="auth-layout-content">
        <Outlet />
      </div>

      <p className="auth-layout-footer">
        Powered by Student-Alumni Collaboration
      </p>
    </div>
  );
};

export default AuthLayout;
