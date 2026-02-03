import { useState, useEffect } from "react";
import userService from "../../services/user.service";
import Loader from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import '../page_css/Dashboard.css';

/**
 * AlumniDirectory - Full-Stack Dynamic Board
 * Fetches and displays all community alumni from the database
 */
const AlumniDirectory = () => {
    const [alumni, setAlumni] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterDept, setFilterDept] = useState("ALL");

    useEffect(() => {
        const fetchAlumni = async () => {
            try {
                setLoading(true);
                const data = await userService.getAlumni();
                setAlumni(data);
            } catch (err) {
                console.error("Failed to load alumni directory:", err);
                setError("Could not load alumni directory at this time.");
            } finally {
                setLoading(false);
            }
        };
        fetchAlumni();
    }, []);

    const filteredAlumni = alumni.filter(person => {
        const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            person.department?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesDept = filterDept === "ALL" || person.department === filterDept;

        return matchesSearch && matchesDept;
    });

    const departments = ["ALL", "CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "MBA", "CHEMICAL", "FOOD TECH"];

    return (
        <div className="dashboard fade-in">
            <div className="dashboard-header" style={{ marginBottom: '48px' }}>
                <div>
                    <span className="badge-category">The Network</span>
                    <h1>Alumni Directory</h1>
                    <p className="content-width">Connect with thousands of Kongu engineers leading global innovation across various industries.</p>
                </div>
            </div>

            <div className="control-bar">
                <input
                    type="text"
                    placeholder="Search by name or department..."
                    className="dir-search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select 
                    value={filterDept} 
                    onChange={(e) => setFilterDept(e.target.value)}
                    className="dir-select"
                >
                    {departments.map(dept => (
                        <option key={dept} value={dept}>{dept === 'ALL' ? 'All Departments' : dept}</option>
                    ))}
                </select>
            </div>

            {error && <ErrorMessage message={error} onClose={() => setError("")} />}

            {loading ? <Loader /> : (
                <div className="directory-grid">
                    {filteredAlumni.map((person) => (
                        <div key={person._id} className="card-editorial fade-in shadow-magazine" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
                                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f5f5f5', overflow: 'hidden', flexShrink: 0 }}>
                                    <img
                                        src={person.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${person.name}`}
                                        alt={person.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '18px', margin: 0 }}>{person.name}</h3>
                                    <p style={{ fontSize: '12px', color: 'var(--accent-olive)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                        Class of {person.batchYear} • {person.department}
                                    </p>
                                </div>
                            </div>

                            <p style={{ fontSize: '14px', color: 'var(--text-grey)', margin: '0 0 20px 0', flex: 1, lineHeight: '1.6' }}>
                                {person.bio || "No bio shared yet. Working towards excellence in engineering."}
                            </p>

                            <div className="divider-short" style={{ margin: '0 0 20px 0' }}></div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div>
                                    <p style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 4px 0' }}>{person.company || "Leading Tech Corp"}</p>
                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>📍 {person.location || "India"}</p>
                                </div>
                                {person.linkedIn && (
                                    <a href={person.linkedIn} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontSize: '18px' }}>
                                        🔗
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && filteredAlumni.length === 0 && (
                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                    <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>No alumni found matching your search.</p>
                </div>
            )}
        </div>
    );
};

export default AlumniDirectory;
