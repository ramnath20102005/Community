import { useState, useEffect } from 'react';
import postService from '../services/post.service';
import DetailModal from './DetailModal';
import { useAuth } from '../hooks/useAuth';
import { fileToBase64 } from '../utils/fileToBase64';
import './comp_css/JobApplication.css';

const JobApplicationModal = ({ isOpen, onClose, jobId, jobTitle, onSuccess }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        department: user?.department || "",
        batch: user?.batchYear || "",
        phone: "",
        message: "",
        resume: null
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name,
                email: user.email,
                department: user.department || "",
                batch: user.batchYear || ""
            }));
        }
    }, [user, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setFormData(prev => ({ ...prev, resume: file }));
            setError("");
        } else {
            setError("Please upload a valid PDF resume.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.resume) {
            setError("Resume upload is required.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const resumeBase64 = await fileToBase64(formData.resume);
            
            const applicationData = {
                name: formData.name,
                department: formData.department,
                batch: formData.batch,
                phone: formData.phone,
                message: formData.message,
                resumeUrl: resumeBase64
            };

            await postService.applyToJob(jobId, applicationData);
            onSuccess("Application submitted successfully!");
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit application.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DetailModal isOpen={isOpen} onClose={onClose}>
            <div className="application-modal-content">
                <header className="application-header">
                    <span className="badge-category">Career Opportunity</span>
                    <h2>Express Interest</h2>
                    <p>Applying for: <strong>{jobTitle}</strong></p>
                </header>

                <form onSubmit={handleSubmit} className="application-form">
                    {error && <div className="error-banner">{error}</div>}
                    
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input 
                                type="text" 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input 
                                type="email" 
                                value={formData.email}
                                readOnly
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label>Department</label>
                            <input 
                                type="text" 
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                required
                                placeholder="e.g. CSE"
                            />
                        </div>
                        <div className="form-group">
                            <label>Batch Year</label>
                            <input 
                                type="text" 
                                name="batch"
                                value={formData.batch}
                                onChange={handleChange}
                                required
                                placeholder="e.g. 2024"
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input 
                                type="tel" 
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                pattern="[0-9]{10}"
                                title="Please enter a valid 10-digit phone number"
                                placeholder="10-digit number"
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Resume (PDF only)</label>
                            <input 
                                type="file" 
                                accept=".pdf"
                                onChange={handleFileChange}
                                required
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Message (Optional)</label>
                            <textarea 
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Tell the recruiter a bit about yourself..."
                                rows="3"
                            ></textarea>
                        </div>
                    </div>

                    <div className="application-actions">
                        <button type="button" onClick={onClose} className="btn btn-outline">Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Processing..." : "Submit Interest"}
                        </button>
                    </div>
                </form>
            </div>
        </DetailModal>
    );
};

export default JobApplicationModal;
