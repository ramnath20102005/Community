import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useForm } from "../../hooks/useForm";
import { validators } from "../../utils/validators";
import authService from "../../services/auth.service";
import SuccessMessage from "../../components/SuccessMessage";
import ErrorMessage from "../../components/ErrorMessage";
import Loader from "../../components/Loader";
import '../page_css/Login.css';

/**
 * Login Page - Premium Editorial Design
 */
const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const validationRules = {
        email: (value) => {
            const basic = validators.email(value);
            if (basic) return basic;
            if (!value.endsWith("@kongu.edu")) return "Please use your @kongu.edu email";
            return "";
        },
        password: (value) => !value ? "Password is required" : "",
    };

    const { values, errors, handleChange, handleBlur, handleSubmit, isSubmitting } =
        useForm({ email: "", password: "" }, validationRules);

    const onSubmit = async (formValues) => {
        try {
            setError("");

            // Attempt REAL backend login
            const response = await authService.login(formValues.email, formValues.password);

            if (response && response.token) {
                setSuccess("AUTHENTICATION SUCCESSFUL");
                setTimeout(() => {
                    login(response.user, response.token);
                    navigate("/general");
                }, 1000);
            }
        } catch (err) {
            console.error("Login attempt failed:", err);
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <header className="login-header">
                    <h1>KONGU COMMUNITY</h1>
                    <p>UNIFIED STUDENT-ALUMNI PORTAL</p>
                </header>

                {error && <ErrorMessage message={error} onClose={() => setError("")} />}
                {success && <SuccessMessage message={success} />}

                <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                    <div className="login-form-group">
                        <label>IDENTITY / @KONGU.EDU EMAIL</label>
                        <input
                            type="email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.email ? "error" : ""}
                            placeholder="your.email@kongu.edu"
                            autoComplete="off"
                            required
                        />
                        {errors.email && <span className="login-error-text">{errors.email}</span>}
                    </div>

                    <div className="login-form-group">
                        <label>SECURE KEY / PASSWORD</label>
                        <input
                            type="password"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.password ? "error" : ""}
                            placeholder="••••••••"
                            required
                        />
                        {errors.password && <span className="login-error-text">{errors.password}</span>}
                    </div>

                    <button type="submit" className="login-submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? <Loader size="small" message="" /> : "VERIFY & ENTER"}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        Don't have an account? <Link to="/register">Register here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
