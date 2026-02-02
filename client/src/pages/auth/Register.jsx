import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useForm } from "../../hooks/useForm";
import { validators, composeValidators } from "../../utils/validators";
import { detectRoleFromEmail, parseKonguEmail } from "../../utils/roleDetector";
import authService from "../../services/auth.service";
import ErrorMessage from "../../components/ErrorMessage";
import SuccessMessage from "../../components/SuccessMessage";
import Loader from "../../components/Loader";
import "../page_css/Register.css";

/**
 * Register Page - Premium Editorial Design
 * Only accepts @kongu.edu emails
 */
const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [emailInfo, setEmailInfo] = useState(null);

    const validationRules = {
        name: validators.required("Full Name"),
        email: validators.konguEmail,
        password: composeValidators(validators.password, validators.minLength(6, "Password")),
        confirmPassword: validators.confirmPassword,
    };

    const { values, errors, handleChange, handleBlur, handleSubmit, isSubmitting } =
        useForm({ name: "", email: "", password: "", confirmPassword: "" }, validationRules);

    const strength = validators.passwordStrength(values.password);

    const handleEmailChange = (e) => {
        handleChange(e);
        const email = e.target.value;
        if (email.endsWith("@kongu.edu")) {
            const parsed = parseKonguEmail(email);
            if (parsed) {
                const role = detectRoleFromEmail(email);
                setEmailInfo({ ...parsed, role });
            } else { setEmailInfo(null); }
        } else { setEmailInfo(null); }
    };

    const onSubmit = async (formValues) => {
        try {
            setError("");
            setSuccess("");

            // Backend registration
            const response = await authService.register({
                name: formValues.name,
                email: formValues.email,
                password: formValues.password
            });

            setSuccess("WELCOME TO THE COMMUNITY");

            setTimeout(() => {
                register(response.user, response.token);
                navigate("/general");
            }, 1200);
        } catch (err) {
            console.error("Registration failed:", err);
            setError(err.response?.data?.message || "Registration failed. Server error.");
        }
    };

    return (
        <div className="register-page">
            <div className="register-card">
                <header className="register-header">
                    <h1>CREATE ACCOUNT</h1>
                    <p>JOIN THE KONGU COMMUNITY GATEWAY</p>
                </header>

                {error && <ErrorMessage message={error} onClose={() => setError("")} />}
                {success && <SuccessMessage message={success} />}

                <form onSubmit={handleSubmit(onSubmit)} className="register-form">
                    <div className="register-form-group">
                        <label>FULL NAME *</label>
                        <input
                            type="text"
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.name ? "error" : ""}
                            placeholder="e.g. Rahul Sharma"
                            autoComplete="off"
                            required
                        />
                        {errors.name && <span className="register-error-text">{errors.name}</span>}
                    </div>

                    <div className="register-form-group">
                        <label>COLLEGE EMAIL *</label>
                        <input
                            type="email"
                            name="email"
                            value={values.email}
                            onChange={handleEmailChange}
                            onBlur={handleBlur}
                            className={errors.email ? "error" : ""}
                            placeholder="your.id@kongu.edu"
                            autoComplete="off"
                            required
                        />
                        {errors.email && <span className="register-error-text">{errors.email}</span>}

                        {emailInfo && !errors.email && (
                            <div className="email-info-box">
                                <span>✨ IDENTITY DETECTED: <strong>{emailInfo.role}</strong> / {emailInfo.department} (Class of {emailInfo.joiningYear + 4})</span>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                        <div className="register-form-group">
                            <label>SECURE KEY *</label>
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
                            {values.password && (
                                <div className="strength-container">
                                    <div className="strength-bar-bg">
                                        <div className="strength-bar-fill" style={{
                                            width: `${(strength.score + 1) * 20}%`,
                                            background: strength.color
                                        }} />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                                        <span style={{ color: strength.color, fontWeight: '700' }}>{strength.label.toUpperCase()}</span>
                                        <span style={{ color: 'var(--text-grey)' }}>{strength.advice}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="register-form-group">
                            <label>CONFIRM KEY *</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={values.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={errors.confirmPassword ? "error" : ""}
                                placeholder="••••••••"
                                required
                            />
                            {errors.confirmPassword && <span className="register-error-text">{errors.confirmPassword}</span>}
                        </div>
                    </div>

                    <button type="submit" className="register-submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? <Loader size="small" message="" /> : "VERIFY & REGISTER"}
                    </button>
                </form>

                <div className="register-footer">
                    <p>
                        ALREADY A MEMBER? <Link to="/login">LOGIN INSTEAD</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
