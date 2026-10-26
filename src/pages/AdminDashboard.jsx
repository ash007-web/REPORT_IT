import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useItems } from "../hooks/useItems";

export default function AdminDashboard() {
  const { items, activeCount, lostCount, foundCount, isLoading, error, resolveItem, refetch } = useItems();

  const [confirmDialog, setConfirmDialog] = useState(null);
  const [notification, setNotification] = useState(null);

  const totalReports = items.length;
  const pendingReports = activeCount; // active reports awaiting resolution
  const resolvedCases = items.filter((item) => item.status === "resolved").length;

  // Recent reports (top 5)
  const recentReports = useMemo(() => items.slice(0, 5), [items]);

  // Distribution percentages
  const lostPercentage = totalReports > 0 ? Math.round((lostCount / totalReports) * 100) : 0;
  const foundPercentage = totalReports > 0 ? Math.round((foundCount / totalReports) * 100) : 0;
  const resolvedPercentage = totalReports > 0 ? Math.round((resolvedCases / totalReports) * 100) : 0;

  const handleResolveConfirm = async (item) => {
    try {
      await resolveItem(item.id);
      setNotification({
        type: "success",
        message: `Report #${String(item.id).padStart(4, "0")} marked as resolved.`,
      });
      refetch();
    } catch (err) {
      setNotification({
        type: "error",
        message: err.message || "Failed to resolve report.",
      });
    } finally {
      setConfirmDialog(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`
            border-2 border-[#111827] p-4 flex items-center justify-between
            ${
              notification.type === "success"
                ? "bg-[#4361EE]/10 border-[#4361EE] text-[#4361EE]"
                : "bg-[#E63946]/10 border-[#E63946] text-[#E63946]"
            }
          `}
        >
          <p className="font-body text-xs font-[800] uppercase tracking-wider">
            {notification.message}
          </p>
          <button
            onClick={() => setNotification(null)}
            className="font-body text-xs font-[800] uppercase"
          >
            ✕ Dismiss
          </button>
        </div>
      )}

      {/* Confirmation Dialog Modal */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md border-2 border-[#111827] bg-white p-7 shadow-[8px_8px_0px_#111827]">
            <h3 className="font-display text-2xl font-[800] uppercase text-[#111827]">
              Confirm Action
            </h3>
            <p className="mt-3 font-body text-sm font-[500] text-[#4B5563]">
              Are you sure you want to mark report <span className="font-[700] text-[#111827]">#{String(confirmDialog.id).padStart(4, "0")} ({confirmDialog.title})</span> as <span className="font-[700] text-[#4361EE]">Resolved</span>? This will close the case in the live system.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmDialog(null)}
                className="border-2 border-[#111827] bg-white px-4 py-2 font-body text-xs font-[800] uppercase tracking-wider text-[#111827] shadow-[2px_2px_0px_#111827]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleResolveConfirm(confirmDialog)}
                className="border-2 border-[#111827] bg-[#4361EE] px-4 py-2 font-body text-xs font-[800] uppercase tracking-wider text-white shadow-[2px_2px_0px_#111827]"
              >
                Confirm Resolution
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b-2 border-[#111827]/15 pb-8">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2.5 w-2.5 bg-[#E63946] animate-pulse" />
            <span className="font-body text-xs font-[800] uppercase tracking-[0.16em] text-[#111827]">
              Administrative Operations / Incident Moderation
            </span>
          </div>

          <h1 className="font-display text-[clamp(2.5rem,4.5vw,4.5rem)] font-[800] uppercase leading-[0.95] tracking-[-0.02em] text-[#111827]">
            Admin Dashboard
          </h1>
          <p className="mt-2 max-w-xl font-body text-[14px] md:text-[15px] font-[500] text-[#4B5563]">
            Comprehensive campus oversight: track incident lifecycles, inspect user records, and resolve custody claims across all university zones.
          </p>
        </div>

        {/* Quick Navigation to Manage Reports */}
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/reports"
            className="
              border-2 border-[#111827] bg-[#111827] px-5 py-3.5
              font-body text-[11px] font-[800] uppercase tracking-[0.1em] text-white
              shadow-[4px_4px_0px_#4361EE] transition-all hover:translate-x-[2px]
              hover:translate-y-[2px] hover:shadow-none
            "
          >
            Manage Reports ({totalReports}) →
          </Link>
          <Link
            to="/admin/users"
            className="
              border-2 border-[#111827] bg-white px-5 py-3.5
              font-body text-[11px] font-[800] uppercase tracking-[0.1em] text-[#111827]
              shadow-[4px_4px_0px_#111827] transition-all hover:translate-x-[2px]
              hover:translate-y-[2px] hover:shadow-none
            "
          >
            Manage Users →
          </Link>
        </div>
      </div>

      {/* Three Primary Required Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AdminSummaryCard
          title="TOTAL REPORTS"
          value={isLoading ? "..." : totalReports}
          subtitle="Cumulative campus incidents logged"
          accent="#111827"
          badge="DATABASE ARCHIVE"
        />
        <AdminSummaryCard
          title="PENDING REPORTS"
          value={isLoading ? "..." : pendingReports}
          subtitle="Active cases awaiting owner return / custody"
          accent="#E63946"
          badge="REQUIRES ACTION"
        />
        <AdminSummaryCard
          title="RESOLVED CASES"
          value={isLoading ? "..." : resolvedCases}
          subtitle="Successfully reconciled and closed cases"
          accent="#4361EE"
          badge="COMPLETED"
        />
      </div>

      {/* Distribution & Moderation Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lost/Found Distribution Card */}
        <div className="border-2 border-[#111827] bg-white/80 p-6 backdrop-blur-xl shadow-[6px_6px_0px_#111827] space-y-6">
          <div className="border-b-2 border-[#111827]/10 pb-3 flex items-center justify-between">
            <h3 className="font-display text-lg font-[800] uppercase tracking-wide text-[#111827]">
              Incident Distribution
            </h3>
            <span className="font-body text-[10px] font-[800] uppercase tracking-[0.12em] text-[#6B7280]">
              Network Split
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between font-body text-xs font-[800] uppercase mb-1">
                <span className="text-[#E63946]">Lost Items ({lostCount})</span>
                <span>{lostPercentage}%</span>
              </div>
              <div className="h-3 border-2 border-[#111827] bg-gray-100">
                <div
                  className="h-full bg-[#E63946] transition-all duration-500"
                  style={{ width: `${lostPercentage}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-body text-xs font-[800] uppercase mb-1">
                <span className="text-[#4361EE]">Found Items ({foundCount})</span>
                <span>{foundPercentage}%</span>
              </div>
              <div className="h-3 border-2 border-[#111827] bg-gray-100">
                <div
                  className="h-full bg-[#4361EE] transition-all duration-500"
                  style={{ width: `${foundPercentage}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-body text-xs font-[800] uppercase mb-1">
                <span className="text-gray-700">Resolution Rate ({resolvedCases})</span>
                <span>{resolvedPercentage}%</span>
              </div>
              <div className="h-3 border-2 border-[#111827] bg-gray-100">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${resolvedPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="border-t-2 border-[#111827]/10 pt-4 text-center">
            <Link
              to="/admin/reports"
              className="font-body text-[11px] font-[800] uppercase tracking-wider text-[#4361EE] hover:underline"
            >
              Open Full Moderation Table →
            </Link>
          </div>
        </div>

        {/* Compact Moderation Overview & Statuses */}
        <div className="lg:col-span-2 border-2 border-[#111827] bg-white/80 p-6 backdrop-blur-xl shadow-[6px_6px_0px_#111827] space-y-6">
          <div className="border-b-2 border-[#111827]/10 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-[800] uppercase tracking-wide text-[#111827]">
                Recent Reports Queue
              </h3>
              <p className="font-body text-[10px] font-[700] uppercase tracking-[0.1em] text-[#6B7280]">
                Latest submissions across campus
              </p>
            </div>
            <Link
              to="/admin/reports"
              className="
                border-2 border-[#111827] bg-white px-3 py-1 font-body text-[10px]
                font-[800] uppercase tracking-[0.08em] text-[#111827] shadow-[2px_2px_0px_#111827]
              "
            >
              View All
            </Link>
          </div>

          {isLoading ? (
            <div className="p-8 text-center font-body text-xs font-[800] uppercase text-gray-500">
              Loading recent reports...
            </div>
          ) : error ? (
            <div className="p-4 border-2 border-[#E63946] text-[#E63946] text-xs font-[800]">
              {error}
            </div>
          ) : recentReports.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body">
                <thead>
                  <tr className="border-b-2 border-[#111827] text-[10px] font-[800] uppercase tracking-[0.12em] text-[#6B7280]">
                    <th className="pb-2">ID</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Title</th>
                    <th className="pb-2">Reporter</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 border-[#111827]/10">
                  {recentReports.map((item) => (
                    <tr key={item.id} className="text-xs hover:bg-black/5">
                      <td className="py-2.5 font-[700] text-[#6B7280]">
                        #{String(item.id).padStart(4, "0")}
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`
                            border-2 px-1.5 py-0.5 text-[9px] font-[800] uppercase
                            ${
                              item.type === "lost"
                                ? "border-[#E63946] bg-[#E63946] text-white"
                                : "border-[#4361EE] bg-[#4361EE] text-white"
                            }
                          `}
                        >
                          {item.type}
                        </span>
                      </td>
                      <td className="py-2.5 font-[700] text-[#111827] max-w-[180px] truncate">
                        {item.title}
                      </td>
                      <td className="py-2.5 text-[#4B5563]">
                        {item.reporter_name || "Unknown"}
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`
                            border-2 px-1.5 py-0.5 text-[9px] font-[800] uppercase
                            ${
                              item.status === "resolved"
                                ? "border-gray-500 bg-gray-200 text-gray-700"
                                : "border-[#111827] bg-emerald-100 text-emerald-800"
                            }
                          `}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        {item.status !== "resolved" ? (
                          <button
                            onClick={() => setConfirmDialog(item)}
                            className="
                              border-2 border-[#111827] bg-white px-2.5 py-1
                              text-[10px] font-[800] uppercase tracking-[0.06em] text-[#111827]
                              shadow-[2px_2px_0px_#111827] hover:shadow-none transition-all
                            "
                          >
                            Resolve
                          </button>
                        ) : (
                          <span className="text-[10px] font-[700] text-gray-500">
                            Closed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-6 text-xs text-gray-500">
              No reports found in database.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminSummaryCard({ title, value, subtitle, accent, badge }) {
  return (
    <div
      className="
        border-2 border-[#111827] bg-white/80 p-6 backdrop-blur-xl
        shadow-[5px_5px_0px_#111827] hover:-translate-y-1 transition-all
        flex flex-col justify-between
      "
    >
      <div>
        <div className="flex items-center justify-between">
          <p
            className="font-body text-[11px] font-[800] uppercase tracking-[0.14em]"
            style={{ color: accent }}
          >
            {title}
          </p>
          <span
            className="border border-[#111827] px-1.5 py-0.5 text-[8px] font-[800] uppercase tracking-wider"
            style={{ backgroundColor: accent, color: "#fff" }}
          >
            {badge}
          </span>
        </div>

        <p className="mt-4 font-display text-5xl font-[800] leading-none text-[#111827]">
          {value}
        </p>

        <p className="mt-2 font-body text-xs font-[500] text-[#6B7280]">
          {subtitle}
        </p>
      </div>

      <div className="mt-6 pt-3 border-t-2 border-[#111827]/10 flex items-center justify-between">
        <span className="h-1.5 w-1.5" style={{ backgroundColor: accent }} />
        <span className="font-body text-[9px] font-[700] uppercase tracking-[0.12em] text-[#6B7280]">
          Verified Postgres Record
        </span>
      </div>
    </div>
  );
}
