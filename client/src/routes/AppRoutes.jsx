import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRole } from "../hooks/useRole";

// Layouts
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Landing from "../pages/Landing";

// Dashboard Pages
import StudentDashboard from "../pages/dashboard/StudentDashboard";
import AlumniDashboard from "../pages/dashboard/AlumniDashboard";
import AdminDashboard from "../pages/dashboard/AdminDashboard";

// Feature Pages
import General from "../pages/general/General";
import CreateEvent from "../pages/events/CreateEvent";
import CreateJob from "../pages/jobs/CreateJob";
import Profile from "../pages/profile/Profile";
import AlumniDirectory from "../pages/alumni/AlumniDirectory";

// Other Pages
import NotFound from "../pages/NotFound";

// Protected Route Component
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

/**
 * Helper component to redirect users to their correct dashboard
 */
const DashboardRedirect = () => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useRole();

  if (authLoading || roleLoading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;

  switch (role) {
    case "ADMIN":
    case "ALUMNI":
    case "STUDENT_EDITOR":
    case "STUDENT":
    default:
      return <Navigate to="/general" replace />;
  }
};

const AppRoutes = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log(`[Navigation] Path: ${location.pathname} | User: ${user ? `${user.name} (${user.role})` : 'Guest'}`);
  }, [location, user]);

  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<Landing />} />

      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={user ? <DashboardRedirect /> : <Login />} />
        <Route path="/register" element={user ? <DashboardRedirect /> : <Register />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Auto-redirect to specific dashboard */}
          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* Student Dashboard */}
          <Route element={<RoleRoute allowedRoles={["STUDENT", "STUDENT_EDITOR"]} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
          </Route>

          {/* Alumni Dashboard */}
          <Route element={<RoleRoute allowedRoles={["ALUMNI"]} />}>
            <Route path="/alumni/dashboard" element={<AlumniDashboard />} />
          </Route>

          {/* Admin Dashboard */}
          <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Feature Routes */}
          <Route path="/general" element={<General />} />
          <Route element={<RoleRoute allowedRoles={["STUDENT_EDITOR", "ALUMNI", "ADMIN"]} />}>
            <Route path="/events/create" element={<CreateEvent />} />
            <Route path="/events/edit/:id" element={<CreateEvent />} /> {/* Reuse CreateEvent for editing */}
          </Route>

          <Route element={<RoleRoute allowedRoles={["ALUMNI", "ADMIN"]} />}>
            <Route path="/jobs/create" element={<CreateJob />} />
            <Route path="/jobs/edit/:id" element={<CreateJob />} /> {/* Reuse CreateJob for editing */}
          </Route>

          <Route path="/profile" element={<Profile />} />
          <Route path="/alumni-directory" element={<AlumniDirectory />} />

          <Route path="/unauthorized" element={
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <h1 style={{ fontSize: '3rem', color: '#ff4d4f' }}>Unauthorized Access</h1>
              <p>You don't have permission to view this section.</p>
              <button onClick={() => window.history.back()} className="btn btn-primary">Go Back</button>
            </div>
          } />
        </Route>
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;