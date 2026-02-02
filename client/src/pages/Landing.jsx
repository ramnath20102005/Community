import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import './page_css/Landing.css';

const Landing = () => {
    const { user } = useAuth();

    return (
        <div className="landing-page">
            {/* --- Hero Section --- */}
            <section className="landing-hero">
                <div className="landing-hero-content fade-in">
                    <span className="landing-badge">Kongu Community Beta</span>

                    <h1>
                        Where Students Grow<br />
                        With Alumni Wisdom
                    </h1>

                    <p className="landing-hero-subtitle">
                        Join the exclusive information gateway for Kongu Engineering College.
                        Connect with club leads, discover hackathons, and land your dream job
                        with alumni mentorship.
                    </p>

                    <div className="landing-hero-actions">
                        {user ? (
                            <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
                        ) : (
                            <>
                                <Link to="/register" className="btn btn-primary">Join Community</Link>
                                <Link to="/login" className="btn">Start Conversation</Link>
                            </>
                        )}
                    </div>
                </div>

                <div className="landing-hero-visual fade-in">
                    <div className="landing-illustration-placeholder">
                        Friendly Illustration of<br />
                        Students & Alumni Collaborating
                    </div>
                </div>
            </section>

            {/* --- Trust Section --- */}
            <section className="landing-trust">
                <div className="container">
                    <h2 className="landing-trust-title">Trusted by 500+ Alumni globally</h2>
                    <div className="landing-stats">
                        <div className="landing-stat">
                            <div className="landing-stat-value">50+</div>
                            <p className="landing-stat-label">Active Clubs</p>
                        </div>
                        <div className="landing-stat">
                            <div className="landing-stat-value">200+</div>
                            <p className="landing-stat-label">Monthly Events</p>
                        </div>
                        <div className="landing-stat">
                            <div className="landing-stat-value">150+</div>
                            <p className="landing-stat-label">Alumni Mentors</p>
                        </div>
                        <div className="landing-stat">
                            <div className="landing-stat-value">98%</div>
                            <p className="landing-stat-label">Support Rate</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Features Section --- */}
            <section className="landing-features">
                <div className="landing-features-grid">
                    <div className="landing-feature-card">
                        <div className="landing-feature-icon">💬</div>
                        <h3 className="landing-feature-title">Real-time Conversations</h3>
                        <p className="landing-feature-text">
                            Directly chat with students and alumni in a safe, moderated environment.
                        </p>
                    </div>
                    <div className="landing-feature-card">
                        <div className="landing-feature-icon">🎓</div>
                        <h3 className="landing-feature-title">Club Information</h3>
                        <p className="landing-feature-text">
                            Get instant updates from club leads about hackathons, workshops, and fests.
                        </p>
                    </div>
                    <div className="landing-feature-card">
                        <div className="landing-feature-icon">💼</div>
                        <h3 className="landing-feature-title">Career Gateway</h3>
                        <p className="landing-feature-text">
                            Alumni-posted job opportunities exclusively for the Kongu student body.
                        </p>
                    </div>
                </div>
            </section>

            {/* --- CTA Section --- */}
            <section className="landing-cta">
                <div className="landing-cta-content">
                    <h2>Ready to start the conversation?</h2>
                    <p className="landing-cta-text">
                        Join the most active academic community today.
                    </p>
                    <Link to="/register" className="btn btn-primary">
                        Get Started for Free
                    </Link>
                </div>
            </section>

            <footer className="landing-footer">
                <p>© 2026 Student Community Platform. Built for Kongu.</p>
            </footer>
        </div>
    );
};

export default Landing;
