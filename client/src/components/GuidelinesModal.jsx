import { 
    X, GraduationCap, Calendar, Briefcase, User, 
    Megaphone, Star, Eye, Sparkles, 
    Rocket, Handshake, Search, 
    Shield, BarChart, FileText, Settings 
} from "lucide-react";
import "./comp_css/GuidelinesModal.css";

const GuidelinesModal = ({ isOpen, onClose, role, userName }) => {
    if (!isOpen) return null;

    const roleContent = {
        STUDENT: {
            title: "Student Explorer",
            tagline: "Your Gateway to Opportunity",
            description: "As a student member, you are the heart of this community. This platform is designed to help you check out what's happening on campus and finding your career path.",
            capabilities: [
                { icon: <GraduationCap size={20} />, text: "Access the Alumni Directory to find mentors." },
                { icon: <Calendar size={20} />, text: "View and register for campus events and hackathons." },
                { icon: <Briefcase size={20} />, text: "Browse job and internship opportunities shared by alumni." },
                { icon: <User size={20} />, text: "Build your profile to showcase your skills." }
            ],
            tips: "Tip: Keep your profile updated so alumni can find you easily!"
        },
        STUDENT_EDITOR: {
            title: "Club Representative",
            tagline: "Voice of the Campus",
            description: "You have been granted special privileges to represent your club or organization. You bridge the gap between students and activities.",
            capabilities: [
                { icon: <Megaphone size={20} />, text: "Create and publish events for your club." },
                { icon: <Star size={20} />, text: "Share updates and news with the entire community." },
                { icon: <Eye size={20} />, text: "Everything a standard student can do (Jobs, Alumni, etc)." },
                { icon: <Sparkles size={20} />, text: "Manage your club's presence on the platform." }
            ],
            tips: "Tip: Use high-quality images for your event posts to get more engagement."
        },
        ALUMNI: {
            title: "Alumni Mentor",
            tagline: "Guiding the Next Generation",
            description: "Welcome back! Your experience is invaluable. This platform allows you to give back to your alma mater by guiding current students.",
            capabilities: [
                { icon: <Rocket size={20} />, text: "Post job openings and internships from your company." },
                { icon: <Handshake size={20} />, text: "Share your professional journey and experiences." },
                { icon: <Calendar size={20} />, text: "Host webinars or mentorship sessions." },
                { icon: <Search size={20} />, text: "Discover talented students for your organization." }
            ],
            tips: "Tip: Students love hearing about 'real-world' experiences—share your stories!"
        },
        ADMIN: {
            title: "System Administrator",
            tagline: "Guardian of the Community",
            description: "You have full control over the platform to ensure a safe and productive environment for everyone.",
            capabilities: [
                { icon: <Shield size={20} />, text: "Manage user roles and permissions." },
                { icon: <BarChart size={20} />, text: "View platform analytics and usage stats." },
                { icon: <FileText size={20} />, text: "Moderate content and posts." },
                { icon: <Settings size={20} />, text: "Configure system settings." }
            ],
            tips: "Tip: Regularly check the dashboard for pending user approvals."
        }
    };

    const content = roleContent[role] || roleContent["STUDENT"];

    return (
        <div className="guidelines-overlay" onClick={onClose}>
            <div className="guidelines-modal fade-in" onClick={e => e.stopPropagation()}>
                <button className="guidelines-close-btn" onClick={onClose}>
                    <X size={20} />
                </button>
                
                <div className="guidelines-header">
                    <span className="guidelines-badge">{content.title}</span>
                    <h2>Hello, {userName?.split(' ')[0] || 'Friend'}</h2>
                    <p className="guidelines-tagline">{content.tagline}</p>
                </div>

                <div className="guidelines-body">
                    <p className="guidelines-desc">{content.description}</p>
                    
                    <div className="guidelines-grid">
                        {content.capabilities.map((cap, index) => (
                            <div key={index} className="guidelines-item">
                                <span className="guidelines-icon">{cap.icon}</span>
                                <span className="guidelines-text">{cap.text}</span>
                            </div>
                        ))}
                    </div>

                    <div className="guidelines-footer">
                        <p>{content.tips}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuidelinesModal;
