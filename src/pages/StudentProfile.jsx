import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useItems } from "../hooks/useItems";

export default function StudentProfile() {
  const { currentUser, logout } = useAuth();
  const isAdmin = currentUser?.role === "admin";

  // For students, fetch their own reports; for admins, fetch global reports
  const { items, isLoading } = useItems(null, isAdmin ? null : currentUser?.id);

  const activeReportsCount = items.filter((i) => i.status === "active").length;
  const resolvedReportsCount = items.filter((i) => i.status === "resolved").length;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className={`h-2 w-2 ${isAdmin ? "bg-[#E63946]" : "bg-[#4361EE]"}`} />
          <span className="font-body text-xs font-[800] uppercase tracking-[0.16em] text-[#111827]">
            Identity Verification / {isAdmin ? "Administrator Credential" : "Student Credential"}
          </span>
        </div>

        <h1 className="font-display text-[clamp(2.5rem,4vw,4rem)] font-[800] uppercase leading-[0.95] tracking-[-0.02em] text-[#111827]">
          {isAdmin ? "Admin Profile" : "Student Profile"}
        </h1>
        <p className="mt-2 font-body text-sm font-[500] text-[#4B5563]">
          {isAdmin
            ? "Campus network security authority and global moderation overview."
            : "Campus network identity and activity summary for authenticated student services."}
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="border-2 border-[#111827] bg-white/80 p-8 backdrop-blur-xl shadow-[8px_8px_0px_#111827] space-y-8">
        {/* User Identity Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#111827]/10 pb-6">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-16 w-16 items-center justify-center border-2 border-[#111827] shadow-[4px_4px_0px_#111827] ${
                isAdmin ? "bg-[#E63946]" : "bg-[#4361EE]"
              }`}
            >
              <span className="font-display text-2xl font-[800] text-white">
                {currentUser?.name?.charAt(0) || "U"}
              </span>
            </div>

            <div>
              <h2 className="font-display text-2xl font-[800] uppercase tracking-wide text-[#111827]">
                {currentUser?.name}
              </h2>
              <p
                className={`font-body text-xs font-[700] uppercase tracking-[0.12em] ${
                  isAdmin ? "text-[#E63946]" : "text-[#4361EE]"
                }`}
              >
                Authorized {isAdmin ? "System Administrator" : "Student"}
              </p>
            </div>
          </div>

          <div className="border-2 border-[#111827] bg-[#F3F4F1] px-4 py-2">
            <p className="font-body text-[10px] font-[800] uppercase tracking-[0.12em] text-[#6B7280]">
              Status
            </p>
            <p className="font-body text-xs font-[800] uppercase text-[#111827]">
              {isAdmin ? "Superuser Active" : "Active & Verified"}
            </p>
          </div>
        </div>

        {/* Profile Attributes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileField
            label={isAdmin ? "ADMIN IDENTIFIER" : "STUDENT ID"}
            value={currentUser?.studentId || "N/A"}
          />
          <ProfileField
            label="FULL NAME"
            value={currentUser?.name || "N/A"}
          />
          <ProfileField
            label="CAMPUS EMAIL"
            value={currentUser?.email || "N/A"}
          />
          <ProfileField
            label="SYSTEM ROLE"
            value={(currentUser?.role || "Student").toUpperCase()}
          />
          <ProfileField
            label="ACCOUNT ENROLLMENT"
            value="Academic Year 2025 – 2026"
          />
          <ProfileField
            label="CAMPUS ACCESS CLEARANCE"
            value={isAdmin ? "Full System & Security Clearance" : "All Blocks & Laboratories"}
          />
        </div>

        {/* Real Activity Metrics */}
        <div className="border-t-2 border-[#111827]/10 pt-6">
          <h3 className="font-body text-xs font-[800] uppercase tracking-[0.14em] text-[#374151] mb-4">
            {isAdmin ? "Global Incident Metrics" : "Incident Submissions Record"}
          </h3>

          <div className="grid grid-cols-3 gap-4">
            <MetricCard
              label={isAdmin ? "GLOBAL REPORTS" : "TOTAL REPORTS"}
              value={isLoading ? "..." : items.length}
              color="#111827"
            />
            <MetricCard
              label={isAdmin ? "PENDING CASES" : "ACTIVE INCIDENTS"}
              value={isLoading ? "..." : activeReportsCount}
              color="#E63946"
            />
            <MetricCard
              label="RESOLVED CASES"
              value={isLoading ? "..." : resolvedReportsCount}
              color="#4361EE"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 border-t-2 border-[#111827]/10 pt-6">
          {isAdmin ? (
            <>
              <Link
                to="/admin/reports"
                className="
                  border-2 border-[#111827] bg-[#111827] px-5 py-2.5
                  font-body text-[11px] font-[800] uppercase tracking-[0.08em] text-white
                  shadow-[3px_3px_0px_#4361EE] hover:shadow-none transition-all
                "
              >
                Manage Reports ({items.length})
              </Link>
              <Link
                to="/admin/users"
                className="
                  border-2 border-[#111827] bg-white px-5 py-2.5
                  font-body text-[11px] font-[800] uppercase tracking-[0.08em] text-[#111827]
                  shadow-[3px_3px_0px_#111827] hover:shadow-none transition-all
                "
              >
                Manage Users
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/my-reports"
                className="
                  border-2 border-[#111827] bg-white px-5 py-2.5
                  font-body text-[11px] font-[800] uppercase tracking-[0.08em] text-[#111827]
                  shadow-[3px_3px_0px_#111827] hover:shadow-none transition-all
                "
              >
                View My Reports ({items.length})
              </Link>

              <Link
                to="/report"
                className="
                  border-2 border-[#111827] bg-[#4361EE] px-5 py-2.5
                  font-body text-[11px] font-[800] uppercase tracking-[0.08em] text-white
                  shadow-[3px_3px_0px_#111827] hover:shadow-none transition-all
                "
              >
                File New Report
              </Link>
            </>
          )}

          <button
            onClick={logout}
            className="
              ml-auto border-2 border-[#111827] bg-[#E63946] px-5 py-2.5
              font-body text-[11px] font-[800] uppercase tracking-[0.08em] text-white
              shadow-[3px_3px_0px_#111827] hover:shadow-none transition-all
            "
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div className="border-2 border-[#111827]/20 bg-white p-4">
      <p className="font-body text-[10px] font-[800] uppercase tracking-[0.14em] text-[#6B7280]">
        {label}
      </p>
      <p className="mt-1 font-body text-[14px] font-[700] text-[#111827]">
        {value}
      </p>
    </div>
  );
}

function MetricCard({ label, value, color }) {
  return (
    <div className="border-2 border-[#111827] bg-[#F3F4F1] p-4 text-center">
      <p className="font-display text-3xl font-[800]" style={{ color }}>
        {value}
      </p>
      <p className="mt-1 font-body text-[9px] font-[800] uppercase tracking-[0.12em] text-[#4B5563]">
        {label}
      </p>
    </div>
  );
}
