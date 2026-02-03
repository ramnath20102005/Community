import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import { validators } from "../../utils/validators";
import { fileToBase64 } from "../../utils/fileToBase64";
import postService from "../../services/post.service";
import { useAuth } from "../../hooks/useAuth";
import Loader from "../../components/Loader";
import SuccessMessage from "../../components/SuccessMessage";
import ErrorMessage from "../../components/ErrorMessage";
import '../page_css/Dashboard.css';

const CreateJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const isEditMode = !!id;

    const validationRules = {
        title: validators.required("Job Title"),
        companyName: validators.required("Company Name"),
        location: validators.required("Location"),
        content: validators.required("Job Description"),
        externalLink: validators.url,
    };

    const { values, errors, handleChange, handleBlur, handleSubmit, isSubmitting, setValues } =
        useForm({ title: "", companyName: "", location: "", content: "", salary: "", externalLink: "" }, validationRules);

    useEffect(() => {
        if (isEditMode) {
            const fetchJob = async () => {
                try {
                    setLoading(true);
                    const job = await postService.getPostById(id);
                    setValues({
                        title: job.title || "",
                        companyName: job.companyName || job.company || "",
                        location: job.location || "",
                        content: job.content || job.description || "",
                        salary: job.salary || "",
                        externalLink: job.externalLink || ""
                    });
                    if (job.image) setUploadedImage(job.image);
                    else if (job.images && job.images.length > 0) setUploadedImage(job.images[0]);
                } catch (err) {
                    setError("Failed to load job details. The post might no longer exist.");
                } finally {
                    setLoading(false);
                }
            };
            fetchJob();
        }
    }, [id, isEditMode, setValues]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const base64 = await fileToBase64(file);
            setUploadedImage(base64);
        } catch (err) {
            setError("Failed to process image.");
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (formValues) => {
        if (!uploadedImage) {
            setError("A corporate logo or banner is mandatory for job postings.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        try {
            setError("");
            
            const postData = {
                ...formValues,
                type: 'JOB_POST',
                image: uploadedImage,
                images: [uploadedImage]
            };

            if (isEditMode) {
                await postService.updatePost(id, postData);
            } else {
                await postService.createPost(postData);
            }

            setSuccess(true);
            setTimeout(() => {
                navigate("/jobs");
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'post'} job. Please try again.`);
        }
    };

    if (user?.role !== "ALUMNI" && !user?.isAdmin) {
        return (
            <div className="dashboard fade-in">
                <div className="card-editorial">
                    <h2 style={{ color: 'var(--text-charcoal)' }}>Access Restricted</h2>
                    <p>Only Alumni members can post job opportunities in this community.</p>
                    <button onClick={() => navigate("/jobs")} className="btn mt-md">Back to Jobs</button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard fade-in">
            <div className="dashboard-header">
                <div>
                    <span className="badge-category">Alumni Gateway</span>
                    <h1>{isEditMode ? "Update Opportunity" : "Share Opportunity"}</h1>
                    <p className="content-width">
                        {isEditMode
                            ? "Refine the details of your job posting to ensure accuracy for the community."
                            : "Help the next generation of Kongu engineers by sharing career opportunities from your organization."}
                    </p>
                </div>
            </div>

            <div className="content-width">
                {loading && <div style={{ textAlign: 'center', padding: '40px' }}><Loader /></div>}
                <div className="card-editorial" style={{ opacity: loading ? 0.5 : 1 }}>
                    {success && <SuccessMessage message={`Job opportunity ${isEditMode ? 'updated' : 'posted'} successfully! 🚀`} onClose={() => setSuccess(false)} />}
                    {error && <ErrorMessage message={error} onClose={() => setError("")} />}

                    <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                        <div className="login-form-group">
                            <label>Visual Branding (Company Logo/Banner) *</label>
                            <div 
                                onClick={() => fileInputRef.current.click()}
                                className="upload-area"
                            >
                                {uploadedImage ? (
                                    <>
                                        <img src={uploadedImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        <div style={{ position: 'absolute', bottom: '15px', right: '15px', background: 'var(--text-charcoal)', color: 'white', padding: '8px 16px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}>Replace Image</div>
                                    </>
                                ) : (
                                    <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                        <div style={{ fontSize: '40px', marginBottom: '10px' }}>🖼️</div>
                                        <p style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>{uploading ? 'Processing...' : 'Select Branding Asset'}</p>
                                        <p style={{ fontSize: '10px', marginTop: '4px' }}>Recommended: 1200x630px JPG/PNG</p>
                                    </div>
                                )}
                            </div>
                            <input 
                                type="file" 
                                hidden 
                                ref={fileInputRef} 
                                onChange={handleImageUpload} 
                                accept="image/*" 
                            />
                        </div>

                        <div className="login-form-group">
                            <label>Job Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={values.title}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={errors.title ? "error" : ""}
                                placeholder="e.g. Software Engineer Graduate"
                            />
                            {errors.title && <span className="login-error-text">{errors.title}</span>}
                        </div>

                        <div className="form-grid">
                            <div className="login-form-group">
                                <label>Company *</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={values.companyName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={errors.companyName ? "error" : ""}
                                    placeholder="e.g. Google"
                                />
                                {errors.companyName && <span className="login-error-text">{errors.companyName}</span>}
                            </div>
                            <div className="login-form-group">
                                <label>Location *</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={values.location}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={errors.location ? "error" : ""}
                                    placeholder="e.g. Bangalore / Remote"
                                />
                                {errors.location && <span className="login-error-text">{errors.location}</span>}
                            </div>
                        </div>

                        <div className="login-form-group">
                            <label>Description *</label>
                            <textarea
                                name="content"
                                value={values.content}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={errors.content ? "error" : ""}
                                placeholder="Detailed job description, requirements and responsibilities..."
                                style={{ minHeight: '150px', resize: 'vertical' }}
                            />
                            {errors.content && <span className="login-error-text">{errors.content}</span>}
                        </div>

                        <div className="form-grid">
                            <div className="login-form-group">
                                <label>Estimated Salary (Optional)</label>
                                <input
                                    type="text"
                                    name="salary"
                                    value={values.salary}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="e.g. 12-15 LPA"
                                />
                            </div>
                            <div className="login-form-group">
                                <label>Application Link</label>
                                <input
                                    type="text"
                                    name="externalLink"
                                    value={values.externalLink}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={errors.externalLink ? "error" : ""}
                                    placeholder="https://company.com/careers/job"
                                />
                                {errors.externalLink && <span className="login-error-text">{errors.externalLink}</span>}
                            </div>
                        </div>

                        <div className="divider-short" style={{ margin: '20px 0' }}></div>

                        <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                            <button type="submit" className="btn btn-primary" style={{ padding: '14px 40px' }} disabled={isSubmitting || loading}>
                                {isSubmitting ? <Loader size="small" message="" /> : (isEditMode ? "Update Publication" : "Post Opportunity")}
                            </button>
                            <button type="button" onClick={() => navigate("/jobs")} className="btn">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <p style={{ marginTop: '40px', fontSize: '13px', color: 'var(--text-muted)' }} className="italic">
                Note: Job posts are visible to the entire community. Please ensure accuracy in descriptions.
            </p>
        </div>
    );
};

export default CreateJob;
