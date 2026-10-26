import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navigation/Navbar";
import StudentDashboard from "../pages/StudentDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import BrowseItems from "../pages/BrowseItems";
import ReportPage from "../pages/ReportPage";
import MyReports from "../pages/MyReports";
import StudentProfile from "../pages/StudentProfile";
import ManageReports from "../pages/ManageReports";
import ManageUsers from "../pages/ManageUsers";

export default function DashboardRouter() {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";

  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      {/* Fixed Top Navbar */}
      <Navbar />

      {/* Main Content Area - with top padding so fixed navbar never overlaps */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-24 pb-16 md:px-8">
        <Routes>
          {/* Index Route redirects based on role */}
          <Route
            index
            element={
              isAdmin ? <Navigate to="/admin" replace /> : <StudentDashboard />
            }
          />

          {/* Student Authorized Routes */}
          <Route
            path="dashboard"
            element={
              !isAdmin ? <StudentDashboard /> : <Navigate to="/admin" replace />
            }
          />
          <Route
            path="browse"
            element={
              !isAdmin ? <BrowseItems /> : <Navigate to="/admin/reports" replace />
            }
          />
          <Route
            path="report"
            element={
              !isAdmin ? <ReportPage /> : <Navigate to="/admin" replace />
            }
          />
          <Route
            path="my-reports"
            element={
              !isAdmin ? <MyReports /> : <Navigate to="/admin/reports" replace />
            }
          />

          {/* Shared Profile Route */}
          <Route path="profile" element={<StudentProfile />} />

          {/* Admin Authorized Routes */}
          <Route
            path="admin"
            element={
              isAdmin ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="admin/reports"
            element={
              isAdmin ? (
                <ManageReports />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />
          <Route
            path="admin/users"
            element={
              isAdmin ? (
                <ManageUsers />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Consistent Neo-Brutalist Footer */}
      <footer className="mx-auto w-full max-w-7xl border-t-2 border-[#111827]/15 px-4 py-8 md:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={`h-2 w-2 ${isAdmin ? "bg-[#E63946]" : "bg-[#4361EE]"}`} />
            <p className="font-body text-[11px] font-[800] uppercase tracking-[0.12em] text-[#111827]">
              REPORT_IT Campus Lost & Found System {isAdmin ? "— Administrative Terminal" : ""}
            </p>
          </div>

          <p className="font-body text-[10px] font-[600] uppercase tracking-[0.14em] text-[#6B7280]">
            User Interface Design Lab • Academic Year 2025 – 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
