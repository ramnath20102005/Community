import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useRole } from "../../hooks/useRole";
import { ACTIONS } from "../../utils/permissions";
import { Link } from "react-router-dom";
import postService from "../../services/post.service";
import Loader from "../../components/Loader";
import Card from "../../components/Card";
import '../page_css/Dashboard.css';

/**
 * Student Dashboard - Full-Stack Implementation
 */
const StudentDashboard = () => {
    const { user } = useAuth();
    const { can } = useRole();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([
        { label: "Community Feed", value: "0", icon: "🗞️" },
        { label: "Club Events", value: "0", icon: "📅" },
        { label: "Opportunities", value: "0", icon: "💼" },
    ]);

    useEffect(() => {
        const fetchRecentActivity = async () => {
            try {
                const data = await postService.getAllPosts();

                // Calculate dynamic counts
                const totalFeed = data.length;
                const totalEvents = data.filter(p => p.type === 'EVENT' || p.type === 'CLUB_UPDATE').length;
                const totalOpp = data.filter(p => p.type === 'JOB_POST' || p.type === 'RESOURCE').length;

                setStats([
                    { label: "Community Feed", value: totalFeed, icon: "🗞️" },
                    { label: "Club Events", value: totalEvents, icon: "📅" },
                    { label: "Opportunities", value: totalOpp, icon: "💼" },
                ]);

                setPosts(data.slice(0, 5)); // Only show top 5 in the feed
            } catch (err) {
                console.error("Dashboard fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecentActivity();
    }, []);

    return (
        <div className="dashboard fade-in">
            <div className="dashboard-header">
                <div>
                    <span className="badge-category">Campus Gateway</span>
                    <h1>Hello, {user?.name.split(' ')[0]}! 👋</h1>
                </div>
            </div>

            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <Card key={index} className="stat-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{ fontSize: '24px', opacity: 0.7 }}>{stat.icon}</div>
                            <div>
                                <h3 className="stat-value" style={{ fontSize: '24px' }}>{stat.value}</h3>
                                <p className="stat-label">{stat.label}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="main-content">
                <div className="section-title-wrapper">
                    <h2 className="section-title">Recent Activity</h2>
                    <Link to="/events" className="view-all-link">view all →</Link>
                </div>

                {loading ? <div style={{ padding: '40px', textAlign: 'center' }}><Loader /></div> : (
                    <div className="activity-feed">
                        {posts.length > 0 ? posts.map(post => (
                            <div key={post._id} className="activity-item">
                                <div className="activity-date">
                                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </div>
                                <div className="activity-info">
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span className="activity-type">{post.clubName || post.type.replace('_', ' ')}</span>
                                    </div>
                                    <h4 className="activity-title" style={{ fontSize: '18px' }}>{post.title}</h4>
                                    <p className="activity-desc" style={{ WebkitLineClamp: '2', display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {post.content}
                                    </p>
                                </div>
                            </div>
                        )) : (
                            <div className="activity-item">
                                <div className="activity-info">
                                    <span className="activity-type">Community</span>
                                    <h4 className="activity-title">Welcome to the Platform</h4>
                                    <p className="activity-desc">Stay tuned for the latest updates from your clubs and alumni.</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
