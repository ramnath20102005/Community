import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useForm } from "../../hooks/useForm";
import { validators } from "../../utils/validators";
import authService from "../../services/auth.service";
import ErrorMessage from "../../components/ErrorMessage";
import Loader from "../../components/Loader";
import '../page_css/Login.css';

/**
 * Login Page - Full-Stack Implementation
 */
const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState("");

    const validationRules = {
        email: (value) => {
            const basic = validators.email(value);
            if (basic) return basic;
            if (!value.endsWith("@kongu.edu")) return "Please use your @kongu.edu email";
            return "";
        },
        password: validators.password,
    };

    const { values, errors, handleChange, handleBlur, handleSubmit, isSubmitting } =
        useForm({ email: "", password: "" }, validationRules);

    const onSubmit = async (formValues) => {
        try {
            setError("");

            // Attempt REAL backend login
            const response = await authService.login(formValues.email, formValues.password);

            if (response && response.token) {
                login(response.user, response.token);
                navigate("/dashboard");
            }
        } catch (err) {
            console.error("Login attempt failed:", err);
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="login-page">
            <div className="login-card fade-in">
                <div className="login-header">
                    <h2>Welcome Back</h2>
                    <p>Enter your details to access the platform</p>
                </div>

                {error && <ErrorMessage message={error} onClose={() => setError("")} />}

                <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                    <div className="login-form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.email ? "error" : ""}
                            placeholder="your.email@kongu.edu"
                        />
                        {errors.email && <span className="login-error-text">{errors.email}</span>}
                    </div>

                    <div className="login-form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.password ? "error" : ""}
                            placeholder="••••••••"
                        />
                        {errors.password && <span className="login-error-text">{errors.password}</span>}
                    </div>

                    <button type="submit" className="btn btn-primary login-submit" disabled={isSubmitting}>
                        {isSubmitting ? <Loader size="small" message="" /> : "Login"}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Don't have an account? <Link to="/register">Register here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
