import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import postService from "../../services/post.service";
import Loader from "../../components/Loader";
import Card from "../../components/Card";
import '../page_css/Dashboard.css';

/**
 * AlumniDashboard - Mentorship & Management Hub
 * Structured to highlight professional contributions and community impact
 */
const AlumniDashboard = () => {
    const { user } = useAuth();
    const [myPosts, setMyPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyActivity = async () => {
            try {
                const allPosts = await postService.getAllPosts();
                const filtered = allPosts.filter(p => p.author?._id === user?.id || p.author === user?.id);
                setMyPosts(filtered);
            } catch (err) {
                console.error("Dashboard activity fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchMyActivity();
    }, [user]);

    const jobCount = myPosts.filter(p => p.type === 'JOB_POST').length;
    const eventCount = myPosts.filter(p => p.type !== 'JOB_POST').length;

    const stats = [
        { label: "Jobs Posted", value: jobCount, icon: "💼", sub: "Active publications" },
        { label: "Events Shared", value: eventCount, icon: "🏛️", sub: "Campus updates" },

        { label: "Contributions", value: jobCount + eventCount, icon: "✨", sub: "Total activity" },
    ];

    return (
        <div className="dashboard fade-in">
            <div className="dashboard-header">
                <div>
                    <span className="badge-category">Alumni Excellence</span>
                    <h1>Welcome, {user?.name?.split(' ')[0]}</h1>
                    <p>Empowering the next generation of Kongu Engineers through your expertise.</p>
                </div>
            </div>

            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <Card key={index} className="stat-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 className="stat-value">{stat.value}</h3>
                                <p className="stat-label">{stat.label}</p>
                                <p className="stat-sub">{stat.sub}</p>
                            </div>
                            <div style={{ fontSize: '24px', opacity: 0.5 }}>{stat.icon}</div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="main-content">
                <div className="section-title-wrapper">
                    <h2 className="section-title">Active Contributions</h2>
                    <Link to="/profile" className="view-all-link">View all activity</Link>
                </div>

                {loading ? <div style={{ padding: '40px', textAlign: 'center' }}><Loader /></div> : (
                    <div className="activity-feed">
                        {myPosts.length > 0 ? myPosts.slice(0, 4).map(post => (
                            <div key={post._id} className="activity-item">
                                <div className="activity-date">
                                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </div>
                                <div className="activity-info">
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span className="activity-type">{post.type.replace('_', ' ')}</span>
                                    </div>
                                    <h4 className="activity-title">{post.title}</h4>
                                    <p className="activity-desc">{post.content.substring(0, 120)}...</p>
                                </div>
                                <Link to="/general" className="btn" style={{ fontSize: '10px', padding: '10px 20px' }}>Manage</Link>
                            </div>
                        )) : (
                            <div className="empty-state-container">
                                <h3 style={{ margin: '0 0 10px 0' }}>No active contributions</h3>
                                <p style={{ fontSize: '14px', color: 'var(--text-grey)' }}>Start by sharing a job or a campus update.</p>
                                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
                                    <Link to="/jobs/create" className="btn btn-primary" style={{ padding: '12px 24px' }}>Post Job</Link>
                                    <Link to="/events/create" className="btn btn-outline" style={{ background: 'white', padding: '12px 24px' }}>Share Update</Link>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlumniDashboard;
