import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useRole } from "../../hooks/useRole";
import postService from "../../services/post.service";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import DetailModal from "../../components/DetailModal";
import Card from "../../components/Card";
import '../page_css/GeneralHub.css';

/**
 * General Hub - Unified Feed for Events & Jobs
 * Sophisticated, high-end design for community engagement
 */
const GeneralHub = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { role } = useRole();
    const [posts, setPosts] = useState([]);
    const [filter, setFilter] = useState('ALL');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Modal state
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, [filter]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const data = await postService.getAllPosts(filter);
            setPosts(data);
        } catch (err) {
            console.error("Failed to fetch hub data:", err);
            setError("Could not load the community hub. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const openDetails = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const closeDetails = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedItem(null), 300);
    };

    const isAuthor = (item) => {
        return user && (item.author?._id === user.id || item.author === user.id);
    };

    const handleDelete = async (postId) => {
        if (window.confirm("Delete this publication permanently?")) {
            try {
                await postService.deletePost(postId);
                setPosts(posts.filter(p => p._id !== postId));
                setIsModalOpen(false);
            } catch (err) {
                setError("Failed to delete.");
            }
        }
    };

    const handleEdit = (item) => {
        const path = item.type === 'JOB_POST' ? `/jobs/edit/${item._id}` : `/events/edit/${item._id}`;
        navigate(path);
    };

    return (
        <div className="hub-container fade-in">
            {/* --- Sophisticated Header --- */}
            <header className="hub-header">
                <div className="hub-header-meta">
                    <span className="hub-badge">Unified Community</span>
                    <span className="hub-date">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
                <h1 className="hub-title">General Hub</h1>
                <p className="hub-subtitle">
                    Discover events, career opportunities, and community updates in one unified ecosystem.
                    Stay connected with the pulse of Kongu.
                </p>

                {/* --- Filters Section --- */}
                <div className="hub-filters">
                    <button
                        className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
                        onClick={() => setFilter('ALL')}
                    >
                        Everything
                    </button>
                    <button
                        className={`filter-btn ${filter === 'EVENTS' ? 'active' : ''}`}
                        onClick={() => setFilter('EVENTS')}
                    >
                        Campus Events
                    </button>
                    <button
                        className={`filter-btn ${filter === 'JOBS' ? 'active' : ''}`}
                        onClick={() => setFilter('JOBS')}
                    >
                        Job Hub
                    </button>
                </div>
            </header>

            {error && <ErrorMessage message={error} onClose={() => setError("")} />}

            {loading ? (
                <div className="hub-loading"><Loader /></div>
            ) : (
                <div className="hub-feed">
                    {posts.length > 0 ? (
                        <div className="hub-grid">
                            {posts.map((post) => (
                                <Card
                                    key={post._id}
                                    className={`hub-card ${post.type === 'JOB_POST' ? 'job-card' : 'event-card'}`}
                                    onClick={() => openDetails(post)}
                                >
                                    <div className="card-media">
                                        {post.image ? (
                                            <img src={post.image} alt={post.title} />
                                        ) : post.images && post.images.length > 0 ? (
                                            <img src={post.images[0]} alt={post.title} />
                                        ) : (
                                            <div className="card-media-placeholder">
                                                {post.type === 'JOB_POST' ? '💼' : ''}
                                            </div>
                                        )}
                                        <div className="card-type-tag">
                                            {post.type === 'JOB_POST' ? 'JOB' : 'EVENT'}
                                        </div>
                                    </div>

                                    <div className="card-body">
                                        <div className="card-meta">
                                            <span className="card-author">By {post.author?.name || 'Academic Network'}</span>
                                            <span className="card-time">{new Date(post.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <h3 className="card-title">{post.title}</h3>
                                        <p className="card-excerpt">
                                            {post.content || post.description}
                                        </p>

                                        <div className="card-footer">
                                            {post.type === 'JOB_POST' ? (
                                                <div className="job-info">
                                                    <span>📍 {post.location}</span>
                                                    {post.salary && <span className="salary">{post.salary}</span>}
                                                </div>
                                            ) : (
                                                <div className="event-info">
                                                    <span>📅 {post.eventDate ? new Date(post.eventDate).toLocaleDateString() : 'TBA'}</span>
                                                    <span>📍 {post.location || 'Campus'}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="hub-empty">
                            <p>No publications found in this category.</p>
                        </div>
                    )}
                </div>
            )}

            {/* --- Unified Detail Modal --- */}
            <DetailModal isOpen={isModalOpen} onClose={closeDetails}>
                {selectedItem && (
                    <div className="hub-detail-view">
                        <header className="detail-header">
                            <span className="detail-category">{selectedItem.type?.replace('_', ' ')}</span>
                            <h2 className="detail-title">{selectedItem.title}</h2>
                            <div className="detail-meta">
                                <div className="detail-author-pill">
                                    <div className="author-avatar">{(selectedItem.author?.name || 'C').charAt(0)}</div>
                                    <div className="author-info">
                                        <strong>{selectedItem.author?.name || 'Community Member'}</strong>
                                        <span>{selectedItem.author?.role || 'Contributor'}</span>
                                    </div>
                                </div>
                                <div className="detail-date-pill">
                                    Published on {new Date(selectedItem.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </header>

                        <div className="detail-layout">
                            <div className="detail-main">
                                <section className="detail-section">
                                    <h4 className="section-label">Overview</h4>
                                    <div className="detail-content">{selectedItem.content || selectedItem.description}</div>
                                </section>

                                {selectedItem.images && selectedItem.images.length > 0 && (
                                    <section className="detail-section">
                                        <h4 className="section-label">Gallery</h4>
                                        <div className="detail-gallery">
                                            {selectedItem.images.map((img, i) => (
                                                <img key={i} src={img} alt="Gallery" />
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {isAuthor(selectedItem) && (
                                    <div className="detail-actions-box">
                                        <p>Management controls for your publication.</p>
                                        <div className="actions-btns">
                                            <button onClick={() => handleEdit(selectedItem)} className="btn btn-primary">Update</button>
                                            <button onClick={() => handleDelete(selectedItem._id)} className="btn btn-outline">Remove</button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <aside className="detail-sidebar">
                                <div className="sidebar-block">
                                    <h4 className="section-label">Information</h4>
                                    <div className="info-list">
                                        {selectedItem.type === 'JOB_POST' ? (
                                            <>
                                                <div className="info-item"><strong>Company:</strong> {selectedItem.companyName}</div>
                                                <div className="info-item"><strong>Location:</strong> {selectedItem.location}</div>
                                                <div className="info-item"><strong>Salary:</strong> {selectedItem.salary || 'Not disclosed'}</div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="info-item"><strong>Date:</strong> {selectedItem.eventDate ? new Date(selectedItem.eventDate).toLocaleDateString() : 'TBA'}</div>
                                                <div className="info-item"><strong>Location:</strong> {selectedItem.location || 'Campus'}</div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {selectedItem.externalLink && (
                                    <div className="sidebar-block">
                                        <h4 className="section-label">External Resource</h4>
                                        <a href={selectedItem.externalLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary detail-cta">
                                            {selectedItem.type === 'JOB_POST' ? 'Apply Now' : 'Visit Link'}
                                        </a>
                                    </div>
                                )}
                            </aside>
                        </div>
                    </div>
                )}
            </DetailModal>
        </div>
    );
};

export default GeneralHub;
