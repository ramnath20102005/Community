import { useAuth } from "../../hooks/useAuth";
import Card from "../../components/Card";

const AdminDashboard = () => {
    const { user } = useAuth();

    const stats = [
        { label: "Total Users", value: "1,234", icon: "👥", trend: "+12%" },
        { label: "Active Events", value: "18", icon: "📅", trend: "+5%" },
        { label: "Job Postings", value: "45", icon: "💼", trend: "+8%" },
        { label: "Pending Approvals", value: "7", icon: "⏳", trend: "-3%" },
    ];

    const recentActivity = [
        { type: "user", message: "New user registered: John Doe", time: "5 min ago" },
        { type: "event", message: "Event created: Tech Summit 2026", time: "1 hour ago" },
        { type: "job", message: "Job posted: Frontend Developer", time: "2 hours ago" },
        { type: "report", message: "Content reported by user", time: "3 hours ago" },
    ];

    return (
        <div className="dashboard admin-dashboard">
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <p>Platform Overview and Management</p>
            </div>

            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <Card key={index} className="stat-card" hoverable>
                        <div className="stat-content">
                            <span className="stat-icon">{stat.icon}</span>
                            <div className="stat-info">
                                <h3>{stat.value}</h3>
                                <p>{stat.label}</p>
                                <span className={`trend ${stat.trend.startsWith('+') ? 'positive' : 'negative'}`}>
                                    {stat.trend}
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="admin-content">
                <Card title="Recent Activity" className="activity-card">
                    <div className="activity-list">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="activity-item">
                                <p>{activity.message}</p>
                                <span className="activity-time">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card title="Quick Actions" className="actions-card">
                    <div className="action-buttons">
                        <button className="btn-primary">Manage Users</button>
                        <button className="btn-primary">Review Reports</button>
                        <button className="btn-secondary">View Analytics</button>
                        <button className="btn-secondary">System Settings</button>
                    </div>
                </Card>

                <Card title="System Health" className="health-card">
                    <div className="health-metrics">
                        <div className="metric">
                            <span className="metric-label">Server Status</span>
                            <span className="metric-value status-good">✓ Online</span>
                        </div>
                        <div className="metric">
                            <span className="metric-label">Database</span>
                            <span className="metric-value status-good">✓ Connected</span>
                        </div>
                        <div className="metric">
                            <span className="metric-label">API Response</span>
                            <span className="metric-value">45ms</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
