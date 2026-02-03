import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import userService from "../../services/user.service";
import Loader from "../../components/Loader";
import SuccessMessage from "../../components/SuccessMessage";
import ErrorMessage from "../../components/ErrorMessage";
import { Briefcase, MapPin } from "lucide-react";
import { fileToBase64 } from "../../utils/fileToBase64";
import { validators } from "../../utils/validators";
import '../page_css/Dashboard.css';

/**
 * Profile Page - Editorial Aesthetic
 * Allows alumni and students to update their profile information
 */
const Profile = () => {
    const { user, login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: user?.name || "",
        company: user?.company || "",
        location: user?.location || "",
        bio: user?.bio || "",
        linkedIn: user?.linkedIn || "",
        profileImage: user?.profileImage || "",
        contactEmail: user?.contactEmail || "",
        phoneNumber: user?.phoneNumber || "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        // Validation
        if (form.linkedIn) {
            const linkedInError = validators.linkedIn(form.linkedIn);
            if (linkedInError) {
                setError(linkedInError);
                setLoading(false);
                return;
            }
        }

        if (form.phoneNumber && !/^[0-9]{10}$/.test(form.phoneNumber)) {
            setError("Please enter a valid 10-digit phone number.");
            setLoading(false);
            return;
        }

        try {
            const response = await userService.updateProfile(form);
            setSuccess("Profile updated successfully!");
            // Update auth context with new user data
            login(response.user, localStorage.getItem('token'));
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard fade-in">
            <div className="dashboard-header">
                <div>
                    <span className="badge-category">Identity</span>
                    <h1>Your Profile</h1>
                    <p className="content-width">Manage your professional presence within the Kongu community network.</p>
                </div>
            </div>

            <div className="profile-grid">
                <div className="card-editorial shadow-magazine">
                    {success && <SuccessMessage message={success} onClose={() => setSuccess("")} />}
                    {error && <ErrorMessage message={error} onClose={() => setError("")} />}

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="login-form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Edit your display name"
                            />
                        </div>

                        {user?.role === 'ALUMNI' && (
                            <>
                                <div className="form-grid">
                                    <div className="login-form-group">
                                        <label>Current Organization</label>
                                        <input
                                            type="text"
                                            name="company"
                                            value={form.company}
                                            onChange={handleChange}
                                            placeholder="e.g. Microsoft"
                                        />
                                    </div>
                                    <div className="login-form-group">
                                        <label>Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={form.location}
                                            onChange={handleChange}
                                            placeholder="e.g. Seattle, WA"
                                        />
                                    </div>
                                </div>

                                <div className="form-grid">
                                    <div className="login-form-group">
                                        <label>Direct Contact Email (Public)</label>
                                        <input
                                            type="email"
                                            name="contactEmail"
                                            value={form.contactEmail}
                                            onChange={handleChange}
                                            placeholder="Public contact email"
                                        />
                                    </div>
                                    <div className="login-form-group">
                                        <label>Professional Mobile No.</label>
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={form.phoneNumber}
                                            onChange={handleChange}
                                            placeholder="10-digit number"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="login-form-group">
                            <label>Bio / About Me</label>
                            <textarea
                                name="bio"
                                value={form.bio}
                                onChange={handleChange}
                                placeholder="Share a brief introduction with the community..."
                                style={{ minHeight: '120px', resize: 'vertical' }}
                            />
                        </div>

                        <div className="login-form-group">
                            <label>LinkedIn Profile URL</label>
                            <input
                                type="text"
                                name="linkedIn"
                                value={form.linkedIn}
                                onChange={handleChange}
                                placeholder="https://linkedin.com/in/yourprofile"
                            />
                        </div>

                        <div className="login-form-group">
                            <label>Profile Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        try {
                                            const base64 = await fileToBase64(file);
                                            setForm({ ...form, profileImage: base64 });
                                        } catch (err) {
                                            setError("Failed to process image.");
                                        }
                                    }
                                }}
                            />
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '5px' }}>
                                Selected image will be stored directly in your profile.
                            </p>
                        </div>

                        <div className="divider-short" style={{ margin: '20px 0' }}></div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ padding: '14px 40px', width: 'auto' }}
                            disabled={loading}
                        >
                            {loading ? <Loader size="small" message="" /> : "Save Changes"}
                        </button>
                    </form>
                </div>

                <div className="sidebar-preview">
                    <div className="card-editorial shadow-magazine" style={{ textAlign: 'center' }}>
                        <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#f5f5f5', margin: '0 auto 20px', overflow: 'hidden' }}>
                            <img
                                src={form.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${form.name}`}
                                alt="Profile Avatar"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <h2 style={{ fontSize: '24px', margin: '0 0 10px 0' }}>{form.name}</h2>
                        <span className="sidebar-label" style={{ marginBottom: '16px' }}>{user?.role}</span>

                        <div className="divider-short" style={{ margin: '20px auto' }}></div>

                        <p style={{ fontSize: '14px', color: 'var(--text-grey)', lineHeight: '1.6' }}>
                            {form.bio || "No biography provided yet. Add one to let the community know more about you."}
                        </p>

                        {form.company && (
                            <p style={{ marginTop: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <Briefcase size={16} /> {form.company}
                            </p>
                        )}
                        {form.location && (
                            <p style={{ color: 'var(--text-muted)', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px' }}>
                                <MapPin size={14} /> {form.location}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
