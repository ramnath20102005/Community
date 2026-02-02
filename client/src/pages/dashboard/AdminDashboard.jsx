import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import userService from "../../services/user.service";
import Card from "../../components/Card";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import SuccessMessage from "../../components/SuccessMessage";
import "../page_css/Dashboard.css";
import "../page_css/Admin.css";

const AdminDashboard = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [activeTab, setActiveTab] = useState("users"); // 'analytics' or 'users'
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("ALL");

    // Promotion Modal State
    const [showPromoModal, setShowPromoModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [clubName, setClubName] = useState("");
    const [position, setPosition] = useState("Member");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (err) {
            setError("Failed to load users data.");
        } finally {
            setLoading(false);
        }
    };

    const handlePromote = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await userService.promoteToClubMember(selectedUser._id, clubName, position);
            setSuccess(`Successfully promoted ${selectedUser.name}!`);
            setShowPromoModal(false);
            fetchUsers();
            setClubName("");
            setPosition("Member");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to promote user.");
        } finally {
            setLoading(false);
        }
    };

    const handleDemote = async (userId) => {
        if (!window.confirm("Are you sure you want to remove club member status?")) return;
        try {
            setLoading(true);
            await userService.demoteUser(userId);
            setSuccess("User demoted successfully.");
            fetchUsers();
        } catch (err) {
            setError("Failed to demote user.");
        } finally {
            setLoading(false);
        }
    };

    const analytics = {
        total: users.length,
        students: users.filter(u => u.role === 'STUDENT').length,
        alumni: users.filter(u => u.role === 'ALUMNI').length,
        clubMembers: users.filter(u => u.isClubMember).length,
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'ALL' || u.role === filterRole;
        const matchesClub = filterRole === 'CLUB' ? u.isClubMember : true;

        if (filterRole === 'CLUB') return matchesSearch && u.isClubMember;
        return matchesSearch && matchesRole;
    });

    if (loading && users.length === 0) return <Loader />;

    return (
        <div className="dashboard admin-dashboard fade-in">
            <div className="dashboard-header">
                <div>
                    <span className="badge-category">System Administration</span>
                    <h1>Admin Console</h1>
                    <p>Manage users, analytics, and permissions.</p>
                </div>
                <div className="admin-actions">
                    <button className="btn btn-outline" onClick={fetchUsers}>Refresh Data</button>
                </div>
            </div>

            {error && <ErrorMessage message={error} onClose={() => setError("")} />}
            {success && <SuccessMessage message={success} onClose={() => setSuccess("")} />}

            <div className="admin-tabs">
                <button
                    className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    User Management
                </button>
                <button
                    className={`admin-tab ${activeTab === 'analytics' ? 'active' : ''}`}
                    onClick={() => setActiveTab('analytics')}
                >
                    Platform Analytics
                </button>
            </div>

            {activeTab === 'analytics' ? (
                <div className="analytics-view fade-in">
                    <div className="analytics-grid">
                        <div className="analytics-card">
                            <span className="analytics-label">Total Community</span>
                            <div className="analytics-value">{analytics.total}</div>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Registered members</p>
                        </div>
                        <div className="analytics-card">
                            <span className="analytics-label">Active Students</span>
                            <div className="analytics-value">{analytics.students}</div>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Current undergraduates</p>
                        </div>
                        <div className="analytics-card">
                            <span className="analytics-label">Alumni Network</span>
                            <div className="analytics-value">{analytics.alumni}</div>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Graduated mentors</p>
                        </div>
                    </div>

                    <Card title="Engagement Breakdown" className="card-editorial">
                        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px' }}>
                            <div className="text-center">
                                <h4 style={{ fontSize: '32px', marginBottom: '8px' }}>{analytics.clubMembers}</h4>
                                <span className="analytics-label">Club Members</span>
                                <p style={{ fontSize: '11px', marginTop: '4px' }}>With posting privileges</p>
                            </div>
                            <div className="text-center">
                                <h4 style={{ fontSize: '32px', marginBottom: '8px' }}>{users.filter(u => u.role === 'ADMIN').length}</h4>
                                <span className="analytics-label">Admins</span>
                                <p style={{ fontSize: '11px', marginTop: '4px' }}>System moderators</p>
                            </div>
                        </div>
                    </Card>
                </div>
            ) : (
                <div className="user-management-view fade-in">
                    <div className="filters-bar" style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ flex: 2 }}
                        />
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            style={{ flex: 1 }}
                        >
                            <option value="ALL">All Roles</option>
                            <option value="STUDENT">Students</option>
                            <option value="ALUMNI">Alumni</option>
                            <option value="ADMIN">Admins</option>
                            <option value="CLUB">Club Members Only</option>
                        </select>
                    </div>

                    <div className="user-table-container">
                        <table className="user-table">
                            <thead>
                                <tr>
                                    <th>User Information</th>
                                    <th>Role & Status</th>
                                    <th>Department/Batch</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(u => (
                                    <tr key={u._id}>
                                        <td>
                                            <div className="user-info-cell">
                                                <div className="user-avatar">{u.name.charAt(0)}</div>
                                                <div>
                                                    <div style={{ fontWeight: 'bold' }}>{u.name}</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`role-badge ${u.role}`}>{u.role}</span>
                                            {u.isClubMember && <span className="club-member-badge">CLUB MEMBER</span>}
                                        </td>
                                        <td style={{ fontSize: '12px' }}>
                                            {u.department} {u.batchYear ? `• ${u.batchYear}` : ''}
                                            {u.clubName && <div style={{ color: 'var(--accent-olive)', fontWeight: 'bold', marginTop: '4px' }}>{u.clubName}</div>}
                                        </td>
                                        <td>
                                            <div className="action-btns">
                                                {u.role === 'STUDENT' && !u.isClubMember && (
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => {
                                                            setSelectedUser(u);
                                                            setShowPromoModal(true);
                                                        }}
                                                    >
                                                        Promote
                                                    </button>
                                                )}
                                                {u.isClubMember && (
                                                    <button
                                                        className="btn btn-outline btn-sm"
                                                        onClick={() => handleDemote(u._id)}
                                                    >
                                                        Revoke Status
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Promotion Modal */}
            {showPromoModal && (
                <div className="promotion-modal-overlay">
                    <Card className="promotion-modal fade-in" title={`Promote ${selectedUser?.name}`}>
                        <p style={{ marginBottom: '24px', fontSize: '14px', color: 'var(--text-grey)' }}>
                            Assign this student to a club. This will grant them privileges to post events and announcements.
                        </p>
                        <form onSubmit={handlePromote}>
                            <div className="form-group" style={{ marginBottom: '16px' }}>
                                <label style={{ fontSize: '12px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Club Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Google Developer Student Club"
                                    value={clubName}
                                    onChange={(e) => setClubName(e.target.value)}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: '24px' }}>
                                <label style={{ fontSize: '12px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Position</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Technical Lead"
                                    value={position}
                                    onChange={(e) => setPosition(e.target.value)}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowPromoModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                                    {loading ? 'Processing...' : 'Confirm Promotion'}
                                </button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
