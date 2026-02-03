import { useState, useEffect } from 'react';
import postService from '../services/post.service';
import DetailModal from './DetailModal';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';

const JobApplicantsModal = ({ isOpen, onClose, jobId, jobTitle }) => {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen && jobId) {
            fetchApplicants();
        }
    }, [isOpen, jobId]);

    const fetchApplicants = async () => {
        try {
            setLoading(true);
            const data = await postService.getJobApplications(jobId);
            setApplicants(data);
        } catch (err) {
            setError("Failed to load applicants.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DetailModal isOpen={isOpen} onClose={onClose}>
            <div className="applicants-modal-content" style={{ padding: '20px' }}>
                <header style={{ marginBottom: '30px', borderBottom: '1px solid var(--accent-line)', paddingBottom: '20px' }}>
                    <span className="badge-category">Hiring Dashboard</span>
                    <h2 style={{ fontSize: '28px', color: 'var(--text-charcoal)', marginTop: '10px' }}>Interested Students</h2>
                    <p style={{ color: 'var(--text-grey)' }}>Review candidates for: <strong>{jobTitle}</strong></p>
                </header>

                {loading ? <div style={{ padding: '40px', textAlign: 'center' }}><Loader /></div> : (
                    <div className="applicants-list">
                        {error && <ErrorMessage message={error} />}
                        
                        {applicants.length > 0 ? (
                            <div className="user-table-container">
                                <table className="user-table">
                                    <thead>
                                        <tr>
                                            <th>Student Info</th>
                                            <th>Department & Batch</th>
                                            <th>Contact</th>
                                            <th>Resume</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applicants.map(app => (
                                            <tr key={app._id}>
                                                <td>
                                                    <div style={{ fontWeight: 'bold' }}>{app.name}</div>
                                                    <div style={{ fontSize: '11px', color: 'var(--text-grey)' }}>Applied {new Date(app.createdAt).toLocaleDateString()}</div>
                                                </td>
                                                <td>
                                                    <div style={{ fontSize: '13px' }}>{app.department}</div>
                                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Class of {app.batch}</div>
                                                </td>
                                                <td>
                                                    <div style={{ fontSize: '13px' }}>{app.email}</div>
                                                    <div style={{ fontSize: '13px' }}>{app.phone}</div>
                                                </td>
                                                <td>
                                                    <a 
                                                        href={app.resumeUrl} 
                                                        download={`Resume_${app.name.replace(' ', '_')}.pdf`}
                                                        className="btn btn-outline" 
                                                        style={{ padding: '6px 12px', fontSize: '11px' }}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        Download PDF
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '60px 0', opacity: 0.5 }}>
                                <div style={{ fontSize: '48px', marginBottom: '20px' }}>📁</div>
                                <p>No candidates have expressed interest yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DetailModal>
    );
};

export default JobApplicantsModal;
