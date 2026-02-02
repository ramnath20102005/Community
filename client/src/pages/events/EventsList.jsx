import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRole } from "../../hooks/useRole";
import { useAuth } from "../../hooks/useAuth";
import { PERMISSIONS } from "../../utils/permissions";
import Card from "../../components/Card";
import postService from "../../services/post.service";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import DetailModal from "../../components/DetailModal";
import '../page_css/Dashboard.css';

/**
 * EventsList - Community Feed Optimized for Students & Alumni
 * Features a heavy editorial layout and author-specific management controls
 */
const EventsList = () => {
    const navigate = useNavigate();
    const { hasPermission } = useRole();
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Modal state
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const canCreateEvent = hasPermission(PERMISSIONS.CREATE_EVENT);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const data = await postService.getAllPosts();
            setEvents(data.filter(p => p.type !== 'JOB_POST'));
        } catch (err) {
            console.error("Failed to fetch posts:", err);
            setError("Could not load community feed. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (postId) => {
        if (window.confirm("Are you sure you want to delete this publication? This action cannot be undone.")) {
            try {
                await postService.deletePost(postId);
                setEvents(events.filter(e => e._id !== postId));
                setIsModalOpen(false);
            } catch (err) {
                setError("Failed to delete the publication.");
            }
        }
    };

    const handleEdit = (postId) => {
        navigate(`/events/edit/${postId}`);
    };

    const openDetails = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const closeDetails = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedEvent(null), 300);
    };

    const isAuthor = (event) => {
        return user && (event.author?._id === user.id || event.author === user.id);
    };

    return (
        <div className="dashboard fade-in">
            <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '40px', paddingBottom: '20px', borderBottom: '1px solid var(--accent-line)' }}>
                <div>
                    <span className="badge-category">The Commons</span>
                    <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: '12px' }}>Campus Dialogue</h1>
                    <p className="content-width" style={{ color: 'var(--text-grey)', fontSize: '15px' }}>
                        The latest announcements, club initiatives, and alumni experiences from the Kongu ecosystem.
                    </p>
                </div>
                {canCreateEvent && (
                    <Link to="/events/create">
                        <button className="btn btn-primary" style={{ padding: '16px 32px' }}>Start a Conversation</button>
                    </Link>
                )}
            </div>

            {error && <ErrorMessage message={error} onClose={() => setError("")} />}

            {loading ? <Loader /> : (
                <div className="events-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '40px', marginTop: '60px' }}>
                    {events.map((event) => (
                        <Card key={event._id || event.id} className="card-editorial fade-in" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid var(--accent-line)' }}>
                            {/* Premium Media Header */}
                            {(event.image || (event.images && event.images.length > 0)) && (
                                <div className="event-image" style={{ height: '300px', background: 'var(--bg-warm)', position: 'relative', overflow: 'hidden' }}>
                                    <img
                                        src={event.image || event.images[0]}
                                        alt={event.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    {event.images && event.images.length > 1 && (
                                        <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(255,255,255,0.9)', color: 'var(--text-charcoal)', padding: '6px 12px', fontSize: '10px', fontWeight: '700', letterSpacing: '1px' }}>
                                            + {event.images.length - 1} GALLERY IMAGES
                                        </div>
                                    )}
                                    <span className="sidebar-label" style={{ position: 'absolute', top: '20px', right: '20px', background: 'var(--text-charcoal)', color: 'white', border: 'none' }}>
                                        {event.type?.replace('_', ' ') || 'General'}
                                    </span>
                                </div>
                            )}

                            <div className="event-details" style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                {!event.image && !event.images?.length && (
                                    <span className="sidebar-label" style={{ marginBottom: '16px', display: 'inline-block' }}>
                                        {event.type?.replace('_', ' ') || 'General'}
                                    </span>
                                )}

                                <h3 style={{ fontSize: '24px', marginBottom: '16px', lineHeight: '1.3' }}>{event.title}</h3>

                                <p style={{ fontSize: '15px', color: 'var(--text-grey)', lineHeight: '1.7', marginBottom: '32px', flex: 1, WebkitLineClamp: '4', display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {event.content || event.description}
                                </p>

                                <div className="divider-short" style={{ marginBottom: '24px', width: '40px' }}></div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--text-charcoal)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                                            {(event.author?.name || 'C').charAt(0)}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{event.author?.name || 'Anonymous'}</span>
                                            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{event.author?.role || 'Member'}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => openDetails(event)} className="btn btn-outline" style={{ padding: '10px 24px', fontSize: '11px', fontWeight: '700' }}>
                                        {isAuthor(event) ? "Manage Entry" : "Read Full Story"}
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {!loading && events.length === 0 && (
                <div style={{ textAlign: 'center', padding: '150px 0' }}>
                    <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '18px' }}>The feed is quiet today. Be the first to start a conversation.</p>
                </div>
            )}

            {/* Premium Event Detail Modal */}
            <DetailModal isOpen={isModalOpen} onClose={closeDetails}>
                {selectedEvent && (
                    <div className="modal-article">
                        <div className="modal-article-header">
                            <span className="section-label">{selectedEvent.type?.replace('_', ' ')}</span>
                            <h2 style={{ fontSize: '48px', margin: '20px 0', lineHeight: '1.1' }}>{selectedEvent.title}</h2>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '30px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-olive)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>
                                    {(selectedEvent.author?.name || 'C').charAt(0)}
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontWeight: '700', fontSize: '16px' }}>{selectedEvent.author?.name || 'Anonymous'}</p>
                                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                                        {selectedEvent.author?.role} • {new Date(selectedEvent.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="modal-layout">
                            <div className="modal-mainContent">
                                <span className="section-label">The Story</span>
                                <div style={{ fontSize: '18px', lineHeight: '1.9', color: 'var(--text-charcoal)', marginBottom: '50px', whiteSpace: 'pre-wrap' }}>
                                    {selectedEvent.content || selectedEvent.description}
                                </div>

                                {selectedEvent.images && selectedEvent.images.length > 0 && (
                                    <div style={{ marginBottom: '50px' }}>
                                        <span className="section-label">Media Gallery</span>
                                        <div style={{ display: 'grid', gridTemplateColumns: selectedEvent.images.length > 1 ? '1fr 1fr' : '1fr', gap: '20px' }}>
                                            {selectedEvent.images.map((img, i) => (
                                                <img
                                                    key={i}
                                                    src={img}
                                                    alt="Event"
                                                    style={{ width: '100%', border: '1px solid var(--accent-line)', objectFit: 'cover', height: '400px' }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {isAuthor(selectedEvent) && (
                                    <div style={{ padding: '40px', background: 'var(--bg-warm)', border: '1px solid var(--text-charcoal)' }}>
                                        <h4 style={{ margin: 0, fontSize: '18px' }}>This is your publication</h4>
                                        <p style={{ margin: '8px 0 24px 0', fontSize: '14px', color: 'var(--text-grey)' }}>You have full control over this entry. You can update the content or manage its visibility.</p>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <button onClick={() => handleEdit(selectedEvent._id)} className="btn btn-primary">Edit Story</button>
                                            <button onClick={() => handleDelete(selectedEvent._id)} className="btn btn-outline" style={{ background: 'white' }}>Delete Publication</button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <aside className="modal-sidebar-info">
                                {selectedEvent.location && (
                                    <section style={{ marginBottom: '40px' }}>
                                        <span className="section-label">Location / Venue</span>
                                        <p style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>📍 {selectedEvent.location}</p>
                                    </section>
                                )}

                                {selectedEvent.eventDate && (
                                    <section style={{ marginBottom: '40px' }}>
                                        <span className="section-label">Scheduled For</span>
                                        <p style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>📅 {new Date(selectedEvent.eventDate).toLocaleDateString()}</p>
                                    </section>
                                )}

                                {(selectedEvent.externalLinks?.length > 0 || selectedEvent.attachments?.length > 0) && (
                                    <section>
                                        <span className="section-label">Resources & Assets</span>
                                        <div style={{ display: 'grid', gap: '12px', marginTop: '10px' }}>
                                            {selectedEvent.externalLinks?.map((link, idx) => (
                                                <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer"
                                                    style={{ display: 'block', fontSize: '12px', color: 'var(--text-charcoal)', textDecoration: 'none', padding: '10px', background: 'var(--bg-white)', border: '1px solid var(--accent-line)' }}>
                                                    🔗 {link.label || 'View Link'}
                                                </a>
                                            ))}
                                            {selectedEvent.attachments?.map((doc, idx) => (
                                                <a key={idx} href={doc.url} target="_blank" rel="noopener noreferrer"
                                                    style={{ display: 'block', fontSize: '12px', color: 'var(--text-charcoal)', textDecoration: 'none', padding: '10px', background: 'var(--bg-white)', border: '1px solid var(--accent-line)' }}>
                                                    📄 <strong>{doc.name}</strong>
                                                </a>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </aside>
                        </div>
                    </div>
                )}
            </DetailModal>
        </div>
    );
};

export default EventsList;
