import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useForm } from "../../hooks/useForm";
import { validators, composeValidators } from "../../utils/validators";
import { isValidKonguEmail, detectRoleFromEmail, parseKonguEmail } from "../../utils/roleDetector";
import authService from "../../services/auth.service";
import ErrorMessage from "../../components/ErrorMessage";
import SuccessMessage from "../../components/SuccessMessage";
import Loader from "../../components/Loader";

/**
 * Register Page - Full-Stack Implementation
 * Only accepts @kongu.edu emails
 */
const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [emailInfo, setEmailInfo] = useState(null);

    const validationRules = {
        name: validators.required("Name"),
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

            setSuccess("Welcome to the Community!");

            setTimeout(() => {
                register(response.user, response.token);
                navigate("/dashboard");
            }, 1000);
        } catch (err) {
            console.error("Registration failed:", err);
            setError(err.response?.data?.message || "Registration failed. Server error.");
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px' }}>
            <div className="card-editorial fade-in" style={{ padding: '48px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h2 style={{ marginBottom: '8px' }}>Create Account</h2>
                    <p>Join the Kongu Community Gateway</p>
                </div>

                {error && <ErrorMessage message={error} onClose={() => setError("")} />}
                {success && <SuccessMessage message={success} />}

                <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                    <div className="login-form-group">
                        <label>Full Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={errors.name ? "error" : ""}
                            placeholder="Student Name"
                        />
                        {errors.name && <span className="login-error-text">{errors.name}</span>}
                    </div>

                    <div className="login-form-group">
                        <label>College Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={values.email}
                            onChange={handleEmailChange}
                            onBlur={handleBlur}
                            className={errors.email ? "error" : ""}
                            placeholder="abc.23cse@kongu.edu"
                        />
                        {errors.email && <span className="login-error-text">{errors.email}</span>}

                        {emailInfo && !errors.email && (
                            <div style={{ marginTop: '12px', background: 'var(--bg-warm)', padding: '12px', border: 'var(--border-thin)', fontSize: '13px' }}>
                                <span>🎉 Auto-detected: <strong>{emailInfo.role}</strong> of {emailInfo.department} ({emailInfo.joiningYear})</span>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="login-form-group">
                            <label>Password *</label>
                            <input
                                type="password"
                                name="password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={errors.password ? "error" : ""}
                                placeholder="••••••••"
                            />
                            {values.password && (
                                <div style={{ marginTop: '8px' }}>
                                    <div style={{ height: '4px', background: '#eee', borderRadius: '2px', overflow: 'hidden' }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${(strength.score + 1) * 20}%`,
                                            background: strength.color,
                                            transition: 'width 0.3s ease'
                                        }} />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '11px' }}>
                                        <span style={{ color: strength.color, fontWeight: 'bold' }}>{strength.label}</span>
                                        <span style={{ color: 'var(--text-grey)' }}>{strength.advice}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="login-form-group">
                            <label>Confirm *</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={values.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={errors.confirmPassword ? "error" : ""}
                                placeholder="••••••••"
                            />
                            {errors.confirmPassword && <span className="login-error-text" style={{ position: 'absolute' }}>{errors.confirmPassword}</span>}
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary login-submit" disabled={isSubmitting}>
                        {isSubmitting ? <Loader size="small" message="" /> : "Get Started"}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Already member? <Link to="/login">Login instead</Link></p>
                </div>
            </div>
        </div>
    );
};

// Course duration for role detection
const COURSE_DURATION = 4;

export default Register;
