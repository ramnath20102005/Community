import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import './page_css/Landing.css';
import landingImage from '../assets/landing.png';

const Landing = () => {
    const { user } = useAuth();

    useEffect(() => {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));

        // Parallax effect on scroll
        const handleScroll = () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.landing-illustration-image');
            parallaxElements.forEach(el => {
                const speed = 0.5;
                el.style.transform = `translateY(${scrolled * speed * 0.1}px) scale(${1 + scrolled * 0.00005})`;
            });
        };

        window.addEventListener('scroll', handleScroll);

        // Add character-by-character animation to headline
        const headline = document.querySelector('.hero-headline');
        if (headline) {
            const text = headline.textContent;
            headline.innerHTML = '';
            text.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char;
                span.style.opacity = '0';
                span.style.display = 'inline-block';
                // Preserve spaces by setting white-space
                if (char === ' ') {
                    span.style.width = '0.3em';
                    span.innerHTML = '&nbsp;';
                }
                span.style.animation = `fadeInChar 0.05s ease-out ${index * 0.03}s forwards`;
                headline.appendChild(span);
            });
        }

        // Add hover effect for subtitle fade
        const subtitle = document.querySelector('.landing-hero-subtitle');
        if (subtitle) {
            subtitle.addEventListener('mouseenter', () => {
                subtitle.style.transform = 'translateX(10px)';
                subtitle.style.color = 'var(--text-charcoal)';
            });
            subtitle.addEventListener('mouseleave', () => {
                subtitle.style.transform = 'translateX(0)';
                subtitle.style.color = 'var(--text-grey)';
            });
        }

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="landing-page">
            {/* --- Hero Section --- */}
            <section className="landing-hero">
                <div className="landing-hero-content">
                    <span className="landing-badge hero-badge">Kongu Community</span>

                    <h1 className="hero-headline">
                        Where Students Grow With<br /> Alumni Wisdom
                    </h1>

                    <p className="landing-hero-subtitle hero-subtitle">
                        A shared space connecting students and alumni for meaningful collaboration,
                        career discovery, and lifelong learning within the Kongu Engineering community.
                    </p>

                    <div className="landing-hero-actions hero-actions">
                        {user ? (
                            <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
                        ) : (
                            <>
                                <Link to="/register" className="btn btn-primary">Join Community</Link>
                                <Link to="/login" className="btn">Sign In</Link>
                            </>
                        )}
                    </div>
                </div>

                <div className="landing-hero-visual hero-visual">
                    <img src={landingImage} alt="Students and Alumni Collaborating" className="landing-illustration-image" />
                </div>
            </section>

            {/* --- Why Kongu Community Section --- */}
            <section className="landing-why scroll-reveal">
                <div className="landing-why-content">
                    <h2 className="section-heading">Why Kongu Community</h2>
                    <div className="section-divider"></div>
                    <p className="section-description">
                        A centralized platform designed to support academic life, foster student-alumni connections,
                        and create opportunities for career growth and mentorship. Built by students, for students.
                    </p>
                    <div className="landing-why-grid">
                        <div className="why-item">
                            <div className="why-icon">🎓</div>
                            <h4>Centralized Communication</h4>
                            <p>Stay updated with campus events, club activities, and important announcements in one place.</p>
                        </div>
                        <div className="why-item">
                            <div className="why-icon">🤝</div>
                            <h4>Knowledge Sharing</h4>
                            <p>Learn from alumni experiences, share insights, and build meaningful professional relationships.</p>
                        </div>
                        <div className="why-item">
                            <div className="why-icon">🚀</div>
                            <h4>Career Support</h4>
                            <p>Access exclusive opportunities, mentorship programs, and guidance from successful alumni.</p>
                        </div>
                        <div className="why-item">
                            <div className="why-icon">💡</div>
                            <h4>Community Growth</h4>
                            <p>Contribute to a thriving ecosystem where every voice matters and collaboration drives success.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- What You Can Do Section --- */}
            <section className="landing-features scroll-reveal">
                <h2 className="section-heading centered">What You Can Do Here</h2>
                <div className="section-divider centered"></div>
                <div className="landing-features-grid">
                    <div className="landing-feature-card feature-card-1">
                        <div className="landing-feature-icon">�</div>
                        <h3 className="landing-feature-title">Campus Events</h3>
                        <p className="landing-feature-text">
                            Discover workshops, hackathons, technical fests, and cultural events happening across campus.
                            Never miss an opportunity to learn and grow.
                        </p>
                    </div>
                    <div className="landing-feature-card feature-card-2">
                        <div className="landing-feature-icon">👥</div>
                        <h3 className="landing-feature-title">Alumni Mentorship</h3>
                        <p className="landing-feature-text">
                            Connect with experienced alumni who understand your journey. Get career advice, industry insights,
                            and guidance tailored to your goals.
                        </p>
                    </div>
                    <div className="landing-feature-card feature-card-3">
                        <div className="landing-feature-icon">💼</div>
                        <h3 className="landing-feature-title">Career Opportunities</h3>
                        <p className="landing-feature-text">
                            Access job postings, internship opportunities, and career resources shared exclusively
                            by alumni for the Kongu community.
                        </p>
                    </div>
                    <div className="landing-feature-card feature-card-4">
                        <div className="landing-feature-icon">�</div>
                        <h3 className="landing-feature-title">Community Discussions</h3>
                        <p className="landing-feature-text">
                            Engage in meaningful conversations, ask questions, share knowledge, and build lasting
                            connections with peers and mentors.
                        </p>
                    </div>
                </div>
            </section>

            {/* --- Built For Section --- */}
            <section className="landing-built scroll-reveal">
                <div className="landing-built-container">
                    <div className="landing-built-content">
                        <h2 className="section-heading">Built for Students & Alumni</h2>
                        <div className="section-divider"></div>
                        <p className="section-description">
                            This platform is more than a network—it's a long-term investment in your academic
                            and professional journey. Whether you're a current student seeking guidance or an
                            alumnus giving back, you belong here.
                        </p>
                        <p className="section-description">
                            We believe in fostering trust, inclusivity, and meaningful collaboration that extends
                            beyond graduation. Join a community that grows with you.
                        </p>
                    </div>
                    <div className="landing-built-visual">
                        <img src={landingImage} alt="Inclusive Community Network" className="landing-illustration-image" />
                    </div>
                </div>
            </section>

            {/* --- CTA Section --- */}
            <section className="landing-cta scroll-reveal">
                <div className="landing-cta-content">
                    <h2>Step Into Your Campus Network</h2>
                    <p className="landing-cta-text">
                        Join the Kongu Community and become part of a thriving ecosystem of students and alumni.
                    </p>
                    {!user && (
                        <Link to="/register" className="btn btn-primary cta-button">
                            Join the Community
                        </Link>
                    )}
                </div>
            </section>

            <footer className="landing-footer">
                <p>© 2026 Kongu Community Platform. Built with care for students and alumni.</p>
            </footer>
        </div>
    );
};

export default Landing;
