import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import './DashboardLayout.css';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detect screen size and set initial sidebar state
    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth <= 1023;
            setIsMobile(mobile);
            setIsSidebarOpen(!mobile); // Open on desktop, closed on mobile
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        if (isMobile) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <div className="dashboard-layout">
            <Navbar onMenuClick={toggleSidebar} />

            <div className="dashboard-container">
                {/* Overlay ONLY on mobile when sidebar is open */}
                {isMobile && isSidebarOpen && (
                    <div
                        className="sidebar-overlay active"
                        onClick={closeSidebar}
                    />
                )}

                <div className={`sidebar-container ${isSidebarOpen ? 'open' : 'collapsed'}`}>
                    <Sidebar />
                </div>

                <main className="main-content-wrapper">
                    <div className="dashboard-content">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
