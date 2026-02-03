import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useForm } from "../../hooks/useForm";
import { useSocket } from "../../hooks/useSocket";
import { EVENT_CREATED } from "../../utils/socketEvents";
import { validators, composeValidators } from "../../utils/validators";
import { fileToBase64, filesToBase64 } from "../../utils/fileToBase64";
import postService from "../../services/post.service";
import Card from "../../components/Card";
import ErrorMessage from "../../components/ErrorMessage";
import SuccessMessage from "../../components/SuccessMessage";
import Loader from "../../components/Loader";

const CreateEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { sendMessage } = useSocket();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isPreview, setIsPreview] = useState(false);
    const [loading, setLoading] = useState(false);

    const isEditMode = !!id;

    // Media States
    const [uploadedImages, setUploadedImages] = useState([]);
    const [uploadedDocs, setUploadedDocs] = useState([]);
    const [externalLinks, setExternalLinks] = useState([{ label: "Portfolio", url: "" }]);
    const [uploading, setUploading] = useState(false);

    const imageInputRef = useRef(null);
    const docInputRef = useRef(null);

    const validationRules = {
        title: composeValidators(validators.required("Title"), validators.minLength(5, "Title")),
        description: composeValidators(validators.required("Description"), validators.minLength(10, "Description")),
        type: validators.required("Content Type"),
    };

    const initialValues = {
        title: "",
        description: "",
        type: "EVENT",
        category: "Technical",
        date: "",
        location: "",
    };

    const { values, errors, handleChange, handleBlur, handleSubmit, isSubmitting, setValues, validate } =
        useForm(initialValues, validationRules);

    // Fetch data if in edit mode
    useEffect(() => {
        if (isEditMode) {
            const fetchEvent = async () => {
                try {
                    setLoading(true);
                    const event = await postService.getPostById(id);
                    setValues({
                        title: event.title || "",
                        description: event.content || event.description || "",
                        type: event.type || "EVENT",
                        category: event.category || "Technical",
                        date: event.eventDate ? new Date(event.eventDate).toISOString().split('T')[0] : "",
                        location: event.location || ""
                    });

                    if (event.images) setUploadedImages(event.images.map(url => ({ url })));
                    else if (event.image) setUploadedImages([{ url: event.image }]);

                    if (event.attachments) setUploadedDocs(event.attachments);
                    if (event.externalLinks) setExternalLinks(event.externalLinks.length > 0 ? event.externalLinks : [{ label: "Portfolio", url: "" }]);
                } catch (err) {
                    setError("Failed to load publication details.");
                } finally {
                    setLoading(false);
                }
            };
            fetchEvent();
        }
    }, [id, isEditMode, setValues]);

    // Scroll to top when previewing
    useEffect(() => {
        if (isPreview) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [isPreview]);

    // --- Media Handlers ---
    const handleFileUpload = async (e, type) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        try {
            setUploading(true);
            setError("");
            
            // Convert files to Base64 locally instead of uploading to server
            const base64Files = await filesToBase64(files);

            if (type === 'image') {
                const newImages = base64Files.map((base64, index) => ({
                    url: base64,
                    name: files[index].name
                }));
                setUploadedImages(prev => [...prev, ...newImages]);
            } else {
                const newDocs = base64Files.map((base64, index) => ({
                    url: base64,
                    originalName: files[index].name,
                    mimetype: files[index].type
                }));
                setUploadedDocs(prev => [...prev, ...newDocs]);
            }
        } catch (err) {
            setError("Failed to convert files to Base64.");
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const addLink = () => setExternalLinks([...externalLinks, { label: "", url: "" }]);
    const removeLink = (index) => setExternalLinks(externalLinks.filter((_, i) => i !== index));
    const updateLink = (index, field, value) => {
        const newLinks = [...externalLinks];
        newLinks[index][field] = value;
        setExternalLinks(newLinks);
    };

    const handlePaste = async (e) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (let item of items) {
            if (item.type.indexOf("image") !== -1) {
                const file = item.getAsFile();
                try {
                    setUploading(true);
                    const base64 = await fileToBase64(file);
                    setUploadedImages(prev => [...prev, { url: base64, name: "pasted-image.png" }]);
                } catch (err) {
                    setError("Failed to process pasted image.");
                } finally {
                    setUploading(false);
                }
            }
        }
    };

    // Toggle Preview
    const togglePreview = (e) => {
        e.preventDefault();
        const isValid = validate();
        
        if (uploadedImages.length === 0) {
            setError("Visual context is mandatory. Please upload at least one image.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (isValid) {
            // Validate External Links
            for (const link of externalLinks) {
                if (link.url.trim()) {
                    const label = link.label.toLowerCase();
                    if (label.includes("linkedin") && validators.linkedIn(link.url)) {
                        setError(`Invalid LinkedIn URL in resources.`);
                        return;
                    }
                    if (label.includes("leetcode") && validators.leetCode(link.url)) {
                        setError(`Invalid LeetCode URL in resources.`);
                        return;
                    }
                }
            }
            setIsPreview(true);
        } else {
            const errorCount = Object.keys(errors).length;
            setError(`Please fix the ${errorCount} highlighted errors before previewing.`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleFinalPost = async () => {
        try {
            setError("");

            const postData = {
                title: values.title,
                content: values.description,
                type: values.type,
                category: values.category,
                eventDate: values.type === 'EVENT' ? values.date : null,
                location: values.location || null,
                images: uploadedImages.map(img => img.url),
                image: uploadedImages[0]?.url || null,
                attachments: uploadedDocs.map(doc => ({
                    name: doc.originalName || doc.name,
                    url: doc.url,
                    fileType: doc.mimetype || doc.fileType
                })),
                externalLinks: externalLinks.filter(link => link.url.trim() !== "")
            };

            let savedPost;
            if (isEditMode) {
                savedPost = await postService.updatePost(id, postData);
                setSuccess(`Update saved successfully!`);
            } else {
                savedPost = await postService.createPost(postData);
                sendMessage(EVENT_CREATED, savedPost);
                setSuccess(`Update shared successfully!`);
            }

            setTimeout(() => navigate("/events"), 1000);
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'share'} information.`);
        }
    };

    const PreviewCard = () => (
        <Card className="card-editorial fade-in" style={{ padding: 0, overflow: 'hidden', maxWidth: '600px', margin: '0 auto', border: '2px solid var(--accent-olive)', boxShadow: 'var(--shadow-soft)' }}>
            <div style={{ background: 'var(--accent-olive)', color: 'white', padding: '12px', fontSize: '13px', textAlign: 'center', letterSpacing: '2px', fontWeight: 'bold' }}>
                POST PREVIEW
            </div>

            {(uploadedImages.length > 0) && (
                <div style={{ height: '350px', background: '#f5f5f5', position: 'relative' }}>
                    <img src={uploadedImages[0].url} alt="Main Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span className="sidebar-label" style={{ position: 'absolute', top: '20px', left: '20px', background: 'var(--bg-ivory)', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                        {values.type.replace('_', ' ')}
                    </span>
                    {uploadedImages.length > 1 && (
                        <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '5px 12px', borderRadius: '4px', fontSize: '12px' }}>
                            +{uploadedImages.length - 1} more images
                        </div>
                    )}
                </div>
            )}

            <div style={{ padding: '40px' }}>
                <h3 style={{ fontSize: '28px', marginBottom: '16px', lineHeight: '1.2' }}>{values.title}</h3>
                <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '32px', color: 'var(--text-grey)', whiteSpace: 'pre-wrap' }}>{values.description}</p>

                {externalLinks.some(l => l.url) && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px' }}>
                        {externalLinks.filter(l => l.url).map((link, idx) => (
                            <span key={idx} style={{ fontSize: '12px', background: 'var(--bg-cream)', padding: '8px 16px', borderRadius: '25px', border: '1px solid var(--accent-olive)', color: 'var(--accent-olive)', fontWeight: 'semibold' }}>
                                🔗 {link.label || 'Resource'}
                            </span>
                        ))}
                    </div>
                )}

                {uploadedDocs.length > 0 && (
                    <div style={{ marginBottom: '32px', background: 'var(--bg-warm)', padding: '20px', borderRadius: '4px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '12px', letterSpacing: '1px' }}>Attached Documents</span>
                        {uploadedDocs.map((doc, idx) => (
                            <div key={idx} style={{ fontSize: '14px', color: 'var(--text-charcoal)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                📄 <span style={{ textDecoration: 'underline' }}>{doc.originalName}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="divider" style={{ margin: '30px 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-olive)', color: 'white', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontWeight: 'bold' }}>
                            {user.name.charAt(0)}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{user.name}</span>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user.role}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );

    return (
        <div className="create-event-page fade-in" onPaste={handlePaste}>
            <div className="page-header">
                <span className="badge-category">{isPreview ? "Confirmation" : (isEditMode ? "Refine Publication" : "Content Creation")}</span>
                <h1>{isPreview ? "Review Your Publication" : (isEditMode ? "Update Your Story" : "Share with Community")}</h1>
                <p className="content-width">
                    {isPreview
                        ? "Take a moment to verify how your story or event will appear in the community feed."
                        : (isEditMode
                            ? "Modify the details of your previous publication to keep the community accurately informed."
                            : "Craft your experience, event, or announcement to inspire and inform your fellow members.")}
                </p>
            </div>

            {error && <ErrorMessage message={error} onClose={() => setError("")} />}
            {success && <SuccessMessage message={success} onClose={() => setSuccess("")} />}

            {loading && !isPreview && <div style={{ textAlign: 'center', padding: '100px' }}><Loader /></div>}

            {isPreview ? (
                <div className="preview-container fade-in" style={{ paddingBottom: '100px' }}>
                    <PreviewCard />
                    <div className="preview-actions" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '50px' }}>
                        <button type="button" className="btn btn-secondary btn-lg" onClick={() => setIsPreview(false)}>
                            ← Edit Content
                        </button>
                        <button type="button" className="btn btn-primary btn-lg" onClick={handleFinalPost} disabled={isSubmitting}>
                            {isSubmitting ? "Saving Changes..." : (isEditMode ? "Save & Publish Update" : "Confirm & Publish Now")}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="create-event-layout" style={{ opacity: loading ? 0.5 : 1 }}>
                    <Card className="form-card">
                        <form className="event-form">
                            <div className="form-group">
                                <label>What are you sharing today? *</label>
                                <select name="type" value={values.type} onChange={handleChange} className="form-select">
                                    <option value="EVENT">📅 Campus Event / Hackathon</option>
                                    <option value="EXPERIENCE">🌟 Daily Life Experience</option>
                                    <option value="CLUB_UPDATE">📢 Club Announcement</option>
                                    <option value="RESOURCE">📚 Learning Resource</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Headline *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={values.title}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={errors.title ? "error" : ""}
                                    placeholder={values.type === 'EXPERIENCE' ? "My Journey at Kongu..." : "Upcoming Tech Summit 2024"}
                                />
                                {errors.title && <span className="error-text">{errors.title}</span>}
                            </div>

                            <div className="form-group">
                                <label>The Story / Details *</label>
                                <textarea
                                    name="description"
                                    value={values.description}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    rows="8"
                                    className={errors.description ? "error" : ""}
                                    placeholder="Dive into the details here. What happened? Why should others care?"
                                />
                                {errors.description && <span className="error-text">{errors.description}</span>}
                            </div>

                            {values.type === 'EVENT' && (
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Date *</label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={values.date}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={errors.date ? "error" : ""}
                                        />
                                        {errors.date && <span className="error-text">{errors.date}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label>Venue</label>
                                        <input type="text" name="location" value={values.location} onChange={handleChange} placeholder="e.g. IT Seminar Hall" />
                                    </div>
                                </div>
                            )}

                            <div className="divider-short"></div>

                            <div className="form-group">
                                <label>External Connections (Github, Portfolio, LeetCode)</label>
                                {externalLinks.map((link, index) => (
                                    <div key={index} style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                                        <input
                                            type="text"
                                            placeholder="Platform"
                                            value={link.label}
                                            onChange={(e) => updateLink(index, 'label', e.target.value)}
                                            style={{ flex: 1 }}
                                        />
                                        <input
                                            type="text"
                                            placeholder="https://..."
                                            value={link.url}
                                            onChange={(e) => updateLink(index, 'url', e.target.value)}
                                            style={{ flex: 2 }}
                                        />
                                        {externalLinks.length > 1 && (
                                            <button type="button" onClick={() => removeLink(index)} className="btn-icon">✕</button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" className="btn btn-outline" onClick={addLink} style={{ fontSize: '11px', padding: '10px 20px' }}>
                                    + Add Context Link
                                </button>
                            </div>

                            <div className="form-actions" style={{ marginTop: '50px', display: 'flex', gap: '20px' }}>
                                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => navigate("/events")}>Back to Feed</button>
                                <button type="button" className="btn btn-primary" style={{ flex: 2 }} onClick={togglePreview}>
                                    Preview Publication →
                                </button>
                            </div>
                        </form>
                    </Card>

                    <div className="media-sidebar">
                        <Card title="Gallery & Assets" className="card-editorial" style={{ position: 'sticky', top: '24px' }}>
                            <div className="upload-controls" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div className="upload-section">
                                    <h4 style={{ fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-charcoal)' }}>Visuals</h4>
                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Upload high-quality images to make your post stand out.</p>
                                    <button type="button" className="btn btn-outline" onClick={() => imageInputRef.current.click()} style={{ width: '100%', fontSize: '11px' }}>
                                        📷 {uploading ? "Uploading..." : "Select Images"}
                                    </button>
                                    <input type="file" multiple accept="image/*" hidden ref={imageInputRef} onChange={(e) => handleFileUpload(e, 'image')} />

                                    <div className="gallery-preview-grid">
                                        {uploadedImages.map((img, i) => (
                                            <div key={i} style={{ height: '60px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--accent-line)', position: 'relative' }}>
                                                <img src={img.url} alt="p" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#f5f5f5' }} />
                                                <button onClick={() => setUploadedImages(prev => prev.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', cursor: 'pointer', padding: '2px' }}>✕</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="divider-short"></div>

                                <div className="upload-section">
                                    <h4 style={{ fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-charcoal)' }}>Attachments</h4>
                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Securely share PDF rules or DOC details (Max 5MB).</p>
                                    <button type="button" className="btn btn-outline" onClick={() => docInputRef.current.click()} style={{ width: '100%', fontSize: '11px' }}>
                                        📄 {uploading ? "Uploading..." : "Select Documents"}
                                    </button>
                                    <input type="file" multiple accept=".pdf,.doc,.docx" hidden ref={docInputRef} onChange={(e) => handleFileUpload(e, 'doc')} />

                                    <div style={{ marginTop: '16px' }}>
                                        {uploadedDocs.map((doc, i) => (
                                            <div key={i} style={{ fontSize: '11px', color: 'var(--text-grey)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-cream)', padding: '6px', borderRadius: '4px' }}>
                                                📎 {doc.originalName}
                                                <button onClick={() => setUploadedDocs(prev => prev.filter((_, idx) => idx !== i))} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="preview-tip" style={{ padding: '16px', background: 'var(--bg-warm)', borderRadius: '4px', borderLeft: '4px solid var(--accent-olive)' }}>
                                    <p style={{ fontSize: '11px', color: 'var(--text-grey)', margin: 0, fontStyle: 'italic' }}>
                                        Pro Tip: Images uploaded here will automatically be included in your post gallery. You can paste screenshots directly into the page!
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateEvent;
