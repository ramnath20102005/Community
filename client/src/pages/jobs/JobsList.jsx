import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRole } from "../../hooks/useRole";
import { useAuth } from "../../hooks/useAuth";
import { ACTIONS } from "../../utils/permissions";
import postService from "../../services/post.service";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import DetailModal from "../../components/DetailModal";
import JobApplicationModal from "../../components/JobApplicationModal";
import Card from "../../components/Card";
import SuccessMessage from "../../components/SuccessMessage";
import { Briefcase, MapPin, Banknote, ExternalLink } from "lucide-react";
import '../page_css/Dashboard.css';

/**
 * JobsList (Job Hub) - Optimized for Alumni and Students
 * Differentiates between 'Posting' (Alumni) and 'Applying' (Student)
 */
const JobsList = () => {
    const navigate = useNavigate();
    const { can } = useRole();
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Modal state
    const [selectedJob, setSelectedJob] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const canCreateJob = can(ACTIONS.CREATE_JOB);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const data = await postService.getAllPosts('JOB_POST');
            setJobs(data);
        } catch (err) {
            console.error("Failed to fetch jobs:", err);
            setError("Could not load latest opportunities. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = (job.author?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (job.author?.department || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === "ALL" || job.type === filterType;
        return matchesSearch && matchesType;
    });

    const jobTypes = ["ALL", "Full-time", "Internship", "Remote", "Contract", "Part-time"];

    const handleDelete = async (postId) => {
        if (window.confirm("Are you sure you want to close this hiring? The post will be permanently removed.")) {
            try {
                await postService.deletePost(postId);
                setJobs(jobs.filter(j => j._id !== postId));
                setIsModalOpen(false);
            } catch (err) {
                setError("Failed to delete the post.");
            }
        }
    };

    const handleEdit = (postId) => {
        navigate(`/jobs/edit/${postId}`);
    };

    const openDetails = (job) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    const closeDetails = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedJob(null), 300);
    };

    const isAuthor = (job) => {
        return user && (job.author?._id === user.id || job.author === user.id);
    };

    return (
        <div className="dashboard fade-in">
            <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '40px', paddingBottom: '20px', borderBottom: '1px solid var(--accent-line)' }}>
                <div>
                    <span className="badge-category">Career Gateway</span>
                    <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: '12px' }}>Professional Opportunities</h1>
                    <p className="content-width" style={{ color: 'var(--text-grey)', fontSize: '15px' }}>
                        Curated career paths shared by the Kongu Alumni Network.
                        {user?.role === 'ALUMNI' ? " Manage your contributions or explore global trends." : " Connect with your future through alumni mentorship."}
                    </p>
                </div>
                {canCreateJob && (
                    <Link to="/jobs/create">
                        <button className="btn btn-primary" style={{ padding: '16px 32px' }}>Post Opportunity</button>
                    </Link>
                )}
            </div>

            <div className="control-bar" style={{ display: 'flex', gap: '20px', marginTop: '40px', flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                    type="text"
                    placeholder="Search by name or department..."
                    style={{ flex: 2, minWidth: '300px', padding: '16px 24px', border: '1px solid var(--accent-line)', background: 'var(--bg-white)' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select 
                    value={filterType} 
                    onChange={(e) => setFilterType(e.target.value)}
                    style={{ flex: 1, minWidth: '180px', padding: '16px 24px', border: '1px solid var(--accent-line)', background: 'var(--bg-white)' }}
                >
                    {jobTypes.map(type => (
                        <option key={type} value={type}>{type === 'ALL' ? 'All Job Types' : type}</option>
                    ))}
                </select>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                    {filteredJobs.length} OPPORTUNITIES FOUND
                </div>
            </div>

            {error && <ErrorMessage message={error} onClose={() => setError("")} />}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px 0' }}><Loader /></div>
            ) : (
                <div className="jobs-grid">
                    {filteredJobs.map((job) => (
                        <Card key={job._id || job.id} className="card-editorial fade-in" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', border: '1px solid var(--accent-line)' }}>
                            {/* Premium Media Header for Jobs */}
                            <div className="job-image" style={{ height: '200px', background: 'var(--bg-warm)', position: 'relative', overflow: 'hidden' }}>
                                {(job.image || (job.images && job.images.length > 0)) ? (
                                    <img
                                        src={job.image || job.images[0]}
                                        alt={job.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div className="media-placeholder" style={{ padding: '20px' }}>
                                        <div className="media-placeholder-icon" style={{ fontSize: '32px' }}><Briefcase size={32} /></div>
                                        <div className="media-placeholder-text" style={{ fontSize: '10px' }}>{job.companyName || "Career Opportunity"}</div>
                                        <div className="media-placeholder-decoration">Job</div>
                                    </div>
                                )}
                                <span className="sidebar-label" style={{ position: 'absolute', top: '15px', right: '15px', background: 'var(--accent-olive)', color: 'white', border: 'none', zIndex: 2, padding: '4px 8px', fontSize: '10px' }}>
                                    {job.type || 'Full-time'}
                                </span>
                            </div>

                            <div className="job-card-body" style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span className="sidebar-label" style={{ padding: 0, fontSize: '12px', letterSpacing: '2px' }}>{job.companyName || job.company || "CORPORATION"}</span>
                                        {isAuthor(job) && <span style={{ fontSize: '9px', fontWeight: 'bold', color: 'var(--accent-olive)', textTransform: 'uppercase' }}>● Your Publication</span>}
                                    </div>
                                </div>

                                <h3 style={{ fontSize: '22px', marginBottom: '12px', lineHeight: '1.4' }}>{job.title}</h3>
                                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '12px', color: 'var(--text-grey)', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {job.location}</span>
                                    {job.salary && <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-charcoal)', display: 'flex', alignItems: 'center', gap: '4px' }}><Banknote size={14} /> {job.salary}</span>}
                                </div>

                                <p className="description-text" style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--text-grey)', marginBottom: '32px', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {job.content || job.description}
                                </p>
                            </div>

                            <div className="divider-short" style={{ width: '60px', marginBottom: '24px' }}></div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg-warm)', color: 'var(--text-charcoal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', border: '1px solid var(--accent-line)' }}>
                                        {(job.author?.name || "A").charAt(0)}
                                    </div>
                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{job.author?.name || "Member"}</span>
                                </div>
                                <button onClick={() => openDetails(job)} className="btn btn-outline" style={{ padding: '10px 24px', fontSize: '11px', fontWeight: '600' }}>
                                    {isAuthor(job) ? "Manage & View" : "View Details"}
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {!loading && jobs.length === 0 && (
                <div style={{ textAlign: 'center', padding: '150px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', opacity: 0.3 }}><Briefcase size={48} /></div>
                    <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '18px' }}>No active opportunities at the moment. Check back soon!</p>
                </div>
            )}

            {/* Premium Job Detail Modal */}
            <DetailModal isOpen={isModalOpen} onClose={closeDetails}>
                {selectedJob && (
                    <div className="modal-article">
                        <div className="modal-article-header">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <span className="section-label">{selectedJob.companyName || selectedJob.company}</span>
                                    <h2 style={{ fontSize: '42px', margin: '10px 0', lineHeight: '1.1' }}>{selectedJob.title}</h2>
                                    <p style={{ fontSize: '18px', color: 'var(--text-grey)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <MapPin size={18} /> {selectedJob.location} • <Briefcase size={18} /> {selectedJob.type || 'Full-time'}
                                    </p>
                                </div>
                                {isAuthor(selectedJob) && (
                                    <div style={{ textAlign: 'right' }}>
                                        <span className="badge-category" style={{ background: 'var(--bg-warm)', padding: '8px 16px', borderRadius: '4px' }}>Your Publication</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="modal-layout">
                            <div className="modal-mainContent">
                                <span className="section-label">Role Overview</span>
                                <div style={{ fontSize: '17px', lineHeight: '1.8', color: 'var(--text-charcoal)', marginBottom: '40px', whiteSpace: 'pre-wrap' }}>
                                    {selectedJob.content || selectedJob.description}
                                </div>

                                <div style={{ padding: '40px', background: 'var(--text-charcoal)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: 0, fontSize: '20px', color: 'white' }}>
                                            {isAuthor(selectedJob) ? "Manage this posting" : "Interested in this role?"}
                                        </h4>
                                        <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.4' }}>
                                            {isAuthor(selectedJob)
                                                ? "You can review applicants or update the details of this opportunity."
                                                : `Shared by ${selectedJob.author?.name} (${selectedJob.author?.role}) to help Kongu juniors.`}
                                        </p>
                                    </div>
                                    <div style={{ marginLeft: '40px' }}>
                                        {isAuthor(selectedJob) ? (
                                            <div style={{ display: 'flex', gap: '12px' }}>
                                                <button onClick={() => handleEdit(selectedJob._id)} className="btn" style={{ background: 'var(--accent-olive)', color: 'white', border: 'none', padding: '12px 24px' }}>Update Info</button>
                                                <button onClick={() => handleDelete(selectedJob._id)} className="btn" style={{ background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 24px' }}>Close Hire</button>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', gap: '12px' }}>
                                                {user?.role === 'STUDENT' && (
                                                    <button 
                                                        className="btn" 
                                                        style={{ background: 'var(--accent-olive)', color: 'white', border: 'none', padding: '16px 40px', fontSize: '14px', fontWeight: '700' }}
                                                        onClick={() => setIsApplyModalOpen(true)}
                                                    >
                                                        Express Interest
                                                    </button>
                                                )}
                                                {selectedJob.externalLink && (
                                                    <a href={selectedJob.externalLink} target="_blank" rel="noopener noreferrer" className="btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.4)', padding: '16px 40px', fontSize: '14px', fontWeight: '700' }}>
                                                        Apply Link <ExternalLink size={16} />
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <aside className="modal-sidebar-info">
                                <section style={{ marginBottom: '40px' }}>
                                    <span className="section-label">Compensation</span>
                                    <p style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>{selectedJob.salary || "Not Disclosed"}</p>
                                </section>

                                <section style={{ marginBottom: '40px' }}>
                                    <span className="section-label">Posted By</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--text-charcoal)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                            {(selectedJob.author?.name || "A").charAt(0)}
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontSize: '14px', fontWeight: '700' }}>{selectedJob.author?.name}</p>
                                            <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>{selectedJob.author?.role}</p>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <span className="section-label">Timeline</span>
                                    <p style={{ fontSize: '13px', color: 'var(--text-grey)' }}>
                                        Shared on {new Date(selectedJob.createdAt).toLocaleDateString()}
                                    </p>
                                </section>
                            </aside>
                        </div>
                    </div>
                )}
            </DetailModal>

            {successMessage && <SuccessMessage message={successMessage} onClose={() => setSuccessMessage("")} />}

            {selectedJob && (
                <JobApplicationModal 
                    isOpen={isApplyModalOpen}
                    onClose={() => setIsApplyModalOpen(false)}
                    jobId={selectedJob._id}
                    jobTitle={selectedJob.title}
                    onSuccess={(msg) => {
                        setSuccessMessage(msg);
                        setIsModalOpen(false);
                    }}
                />
            )}
        </div>
    );
};

export default JobsList;
