import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRole } from "../../hooks/useRole";
import { useAuth } from "../../hooks/useAuth";
import { PERMISSIONS, ACTIONS } from "../../utils/permissions";
import Card from "../../components/Card";
import postService from "../../services/post.service";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import DetailModal from "../../components/DetailModal";
import '../page_css/Dashboard.css';

/**
 * General Feed - Unified Community Hub for Events and Jobs
 * Sophisticated Editorial Design
 */
const General = () => {
    const navigate = useNavigate();
    const { hasPermission, can } = useRole();
    const { user } = useAuth();

    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("ALL"); // ALL, EVENT, JOB

    // Modal state
    const [selectedPost, setSelectedPost] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const canCreateEvent = hasPermission(PERMISSIONS.CREATE_EVENT);
    const canCreateJob = can(ACTIONS.CREATE_JOB);

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        if (filter === "ALL") {
            setFilteredPosts(posts);
        } else if (filter === "EVENT") {
            setFilteredPosts(posts.filter(p => p.type !== 'JOB_POST'));
        } else if (filter === "JOB") {
            setFilteredPosts(posts.filter(p => p.type === 'JOB_POST'));
        }
    }, [filter, posts]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const data = await postService.getAllPosts();

            // 1. Filter out expired events (if eventDate exists and is in the past)
            const now = new Date();
            // Setting time to start of day for fairer comparison of event dates
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            const validPosts = data.filter(post => {
                if (post.eventDate) {
                    const eventDate = new Date(post.eventDate);
                    return eventDate >= startOfToday;
                }
                // Also check for job deadlines if applicable (optional but good practice)
                if (post.deadline) {
                    return new Date(post.deadline) >= startOfToday;
                }
                return true;
            });

            // 2. Sort by recency (newest createdAt first)
            validPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            setPosts(validPosts);
        } catch (err) {
            console.error("Failed to fetch posts:", err);
            setError("Could not load community hub. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (postId) => {
        if (window.confirm("Are you sure you want to delete this publication?")) {
            try {
                await postService.deletePost(postId);
                setPosts(posts.filter(p => p._id !== postId));
                setIsModalOpen(false);
            } catch (err) {
                setError("Failed to delete the publication.");
            }
        }
    };

    const handleEdit = (postId, type) => {
        if (type === 'JOB_POST') {
            navigate(`/jobs/edit/${postId}`);
        } else {
            navigate(`/events/edit/${postId}`);
        }
    };

    const openDetails = (post) => {
        setSelectedPost(post);
        setIsModalOpen(true);
    };

    const closeDetails = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedPost(null), 300);
    };

    const isAuthor = (post) => {
        return user && (post.author?._id === user.id || post.author === user.id);
    };

    return (
        <div className="dashboard fade-in">
            <div className="dashboard-header-modern">
                <div className="header-text-group">
                    <span className="badge-editorial">The Nexus</span>
                    <h1 className="editorial-title">Community Hub</h1>
                    <p className="editorial-subtitle">
                        A sophisticated blend of campus dialogues and professional gateways within the Kongu ecosystem.
                    </p>
                </div>

                <div className="header-actions-group">
                    <div className="filter-pills">
                        <button
                            className={`filter-pill ${filter === 'ALL' ? 'active' : ''}`}
                            onClick={() => setFilter('ALL')}
                        >
                            ALL ENTRIES
                        </button>
                        <button
                            className={`filter-pill ${filter === 'EVENT' ? 'active' : ''}`}
                            onClick={() => setFilter('EVENT')}
                        >
                            CAMPUS EVENTS
                        </button>
                        <button
                            className={`filter-pill ${filter === 'JOB' ? 'active' : ''}`}
                            onClick={() => setFilter('JOB')}
                        >
                            JOB OPPORTUNITIES
                        </button>
                    </div>
                </div>
            </div>

            <div className="quick-actions-bar">
                {canCreateEvent && (
                    <Link to="/events/create" className="btn-modern-action">
                        <span className="icon">✍️</span> Share Event
                    </Link>
                )}
                {canCreateJob && (
                    <Link to="/jobs/create" className="btn-modern-action">
                        <span className="icon">💼</span> Post Job
                    </Link>
                )}
            </div>

            {error && <ErrorMessage message={error} onClose={() => setError("")} />}

            {loading ? <Loader /> : (
                <div className="modern-hub-grid">
                    {filteredPosts.map((post) => (
                        <Card
                            key={post._id || post.id}
                            className={`modern-editorial-card ${post.type === 'JOB_POST' ? 'job-type' : 'event-type'}`}
                            onClick={() => openDetails(post)}
                        >
                            {post.type !== 'JOB_POST' && (post.image || (post.images && post.images.length > 0)) && (
                                <div className="card-media">
                                    <img src={post.image || post.images[0]} alt={post.title} />
                                    <div className="post-type-tag">{post.type?.replace('_', ' ') || 'EVENT'}</div>
                                </div>
                            )}

                            <div className="card-content">
                                {post.type === 'JOB_POST' && (
                                    <div className="job-meta">
                                        <span className="company-badge">{post.companyName || "Professional Opening"}</span>
                                        <span className="job-type-badge">{post.type_of_job || "Full-time"}</span>
                                    </div>
                                )}

                                <h3 className="card-heading">{post.title}</h3>

                                <p className="card-excerpt">
                                    {post.description || post.content}
                                </p>

                                <div className="card-footer">
                                    <div className="author-info">
                                        <div className="author-avatar">
                                            {(post.author?.name || 'C').charAt(0)}
                                        </div>
                                        <div className="author-meta">
                                            <span className="author-name">{post.author?.name || 'Anonymous'}</span>
                                            <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="card-action-indicator">
                                        READ ENTRY ➔
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {!loading && filteredPosts.length === 0 && (
                <div className="empty-hub-state">
                    <div className="empty-icon">📂</div>
                    <p>No publications found in this category.</p>
                </div>
            )}

            {/* Unified Detail Modal */}
            <DetailModal isOpen={isModalOpen} onClose={closeDetails}>
                {selectedPost && (
                    <div className="unified-modal-article">
                        <div className="article-header">
                            <span className="article-category">{selectedPost.type?.replace('_', ' ')}</span>
                            <h2 className="article-title">{selectedPost.title}</h2>
                            <div className="article-meta">
                                <span className="author-tag">By {selectedPost.author?.name}</span>
                                <span className="date-tag">{new Date(selectedPost.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="article-layout">
                            <div className="article-body">
                                <div className="article-content" style={{ whiteSpace: 'pre-wrap' }}>
                                    {selectedPost.content || selectedPost.description}
                                </div>

                                {selectedPost.type === 'JOB_POST' ? (
                                    <div className="job-cta-container">
                                        <div className="job-details-box">
                                            <div className="detail-item">
                                                <span className="label">Location</span>
                                                <span className="value">{selectedPost.location}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="label">Salary</span>
                                                <span className="value">{selectedPost.salary || "Not Disclosed"}</span>
                                            </div>
                                        </div>
                                        <a href={selectedPost.externalLink || 'mailto:alumni@kongu.edu'}
                                            target="_blank" rel="noopener noreferrer"
                                            className="btn btn-primary apply-btn">
                                            Apply for this Opportunity
                                        </a>
                                    </div>
                                ) : (
                                    selectedPost.images && selectedPost.images.length > 0 && (
                                        <div className="article-gallery">
                                            {selectedPost.images.map((img, i) => (
                                                <img key={i} src={img} alt="Gallery" />
                                            ))}
                                        </div>
                                    )
                                )}

                                {isAuthor(selectedPost) && (
                                    <div className="author-management-box">
                                        <h4>Publication Controls</h4>
                                        <div className="management-buttons">
                                            <button onClick={() => handleEdit(selectedPost._id, selectedPost.type)} className="btn btn-primary">Edit Entry</button>
                                            <button onClick={() => handleDelete(selectedPost._id)} className="btn btn-outline" style={{ background: 'white' }}>Revoke Publication</button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <aside className="article-sidebar">
                                {selectedPost.type !== 'JOB_POST' ? (
                                    <>
                                        {selectedPost.location && (
                                            <div className="sidebar-section">
                                                <h5>Location</h5>
                                                <p>📍 {selectedPost.location}</p>
                                            </div>
                                        )}
                                        {selectedPost.eventDate && (
                                            <div className="sidebar-section">
                                                <h5>Event Date</h5>
                                                <p>📅 {new Date(selectedPost.eventDate).toLocaleDateString()}</p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="sidebar-section">
                                        <h5>Company</h5>
                                        <p>🏢 {selectedPost.companyName}</p>
                                    </div>
                                )}

                                {(selectedPost.externalLinks?.length > 0 || selectedPost.attachments?.length > 0) && (
                                    <div className="sidebar-section">
                                        <h5>Resources</h5>
                                        <div className="resource-list">
                                            {selectedPost.externalLinks?.map((link, idx) => (
                                                <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer">🔗 {link.label}</a>
                                            ))}
                                            {selectedPost.attachments?.map((doc, idx) => (
                                                <a key={idx} href={doc.url} target="_blank" rel="noopener noreferrer">📄 {doc.name}</a>
                                            ))}
                                        </div>
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

export default General;
