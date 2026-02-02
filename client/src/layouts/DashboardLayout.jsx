import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import './DashboardLayout.css';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="dashboard-layout">
            <Navbar onMenuClick={toggleSidebar} />

            <div className="dashboard-container">
                <div className={`sidebar-container ${isSidebarOpen ? 'open' : 'collapsed'}`}>
                    <Sidebar isOpen={true} />
                </div>

                <main className="main-content-wrapper">
                    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
