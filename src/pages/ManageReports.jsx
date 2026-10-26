import { useState, useMemo } from "react";
import { useItems } from "../hooks/useItems";

export default function ManageReports() {
  const { items, isLoading, error, resolveItem, deleteItem, refetch } = useItems();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // "all" | "lost" | "found"
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "active" | "resolved"
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" | "oldest"

  // Modal / Feedback state
  const [viewDetailsItem, setViewDetailsItem] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // { type: "resolve" | "delete", item }
  const [notification, setNotification] = useState(null);

  // Filter and sort items
  const filteredReports = useMemo(() => {
    let result = [...items];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(term) ||
          item.description?.toLowerCase().includes(term) ||
          item.location?.toLowerCase().includes(term) ||
          item.reporter_name?.toLowerCase().includes(term) ||
          item.student_id?.toLowerCase().includes(term)
      );
    }

    if (typeFilter !== "all") {
      result = result.filter((item) => item.type === typeFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.created_at || a.item_date || a.date);
      const dateB = new Date(b.created_at || b.item_date || b.date);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [items, searchTerm, typeFilter, statusFilter, sortOrder]);

  const handleActionConfirm = async () => {
    if (!confirmAction) return;

    try {
      if (confirmAction.type === "resolve") {
        await resolveItem(confirmAction.item.id);
        setNotification({
          type: "success",
          message: `Report #${String(confirmAction.item.id).padStart(4, "0")} marked as resolved.`,
        });
      } else if (confirmAction.type === "delete") {
        await deleteItem(confirmAction.item.id);
        setNotification({
          type: "success",
          message: `Report #${String(confirmAction.item.id).padStart(4, "0")} successfully deleted from database.`,
        });
      }
      refetch();
    } catch (err) {
      setNotification({
        type: "error",
        message: err.message || "Action failed to execute.",
      });
    } finally {
      setConfirmAction(null);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setStatusFilter("all");
    setSortOrder("newest");
  };

  return (
    <div className="space-y-8">
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

      {/* Confirmation Dialog */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md border-2 border-[#111827] bg-white p-7 shadow-[8px_8px_0px_#111827]">
            <h3 className="font-display text-2xl font-[800] uppercase text-[#111827]">
              {confirmAction.type === "resolve" ? "Confirm Case Resolution" : "Confirm Record Deletion"}
            </h3>
            <p className="mt-3 font-body text-sm font-[500] text-[#4B5563]">
              {confirmAction.type === "resolve"
                ? `Are you sure you want to resolve case #${String(confirmAction.item.id).padStart(4, "0")} (${confirmAction.item.title})? Status will be updated to resolved in the database.`
                : `Are you sure you want to permanently delete report #${String(confirmAction.item.id).padStart(4, "0")} (${confirmAction.item.title})? This action cannot be undone.`}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="border-2 border-[#111827] bg-white px-4 py-2 font-body text-xs font-[800] uppercase text-[#111827] shadow-[2px_2px_0px_#111827]"
              >
                Cancel
              </button>
              <button
                onClick={handleActionConfirm}
                className={`
                  border-2 border-[#111827] px-4 py-2 font-body text-xs font-[800] uppercase text-white shadow-[2px_2px_0px_#111827]
                  ${confirmAction.type === "resolve" ? "bg-[#4361EE]" : "bg-[#E63946]"}
                `}
              >
                {confirmAction.type === "resolve" ? "Confirm Resolve" : "Delete Record"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Report Details Modal */}
      {viewDetailsItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg border-2 border-[#111827] bg-white p-7 shadow-[8px_8px_0px_#111827] space-y-5">
            <div className="flex items-center justify-between border-b-2 border-[#111827] pb-3">
              <div className="flex items-center gap-2">
                <span
                  className={`border-2 px-2.5 py-0.5 text-[10px] font-[800] uppercase ${
                    viewDetailsItem.type === "lost" ? "border-[#E63946] bg-[#E63946] text-white" : "border-[#4361EE] bg-[#4361EE] text-white"
                  }`}
                >
                  {viewDetailsItem.type}
                </span>
                <span className="font-body text-xs font-[800] text-[#6B7280]">
                  #{String(viewDetailsItem.id).padStart(4, "0")}
                </span>
              </div>
              <button
                onClick={() => setViewDetailsItem(null)}
                className="font-body text-sm font-[800] text-[#111827]"
              >
                ✕ Close
              </button>
            </div>

            <div>
              <h3 className="font-display text-2xl font-[800] uppercase text-[#111827]">
                {viewDetailsItem.title}
              </h3>
              <p className="mt-2 font-body text-sm text-[#4B5563] leading-relaxed">
                {viewDetailsItem.description}
              </p>
            </div>

            <div className="space-y-2 border-y-2 border-[#111827]/10 py-4 text-xs font-body">
              <div className="flex justify-between">
                <span className="font-[700] text-[#6B7280]">LOCATION:</span>
                <span className="font-[600] text-[#111827]">{viewDetailsItem.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-[700] text-[#6B7280]">INCIDENT DATE:</span>
                <span className="font-[600] text-[#111827]">{viewDetailsItem.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-[700] text-[#6B7280]">REPORTED BY:</span>
                <span className="font-[600] text-[#111827]">{viewDetailsItem.reporter_name || "Unknown"} ({viewDetailsItem.student_id || "N/A"})</span>
              </div>
              <div className="flex justify-between">
                <span className="font-[700] text-[#6B7280]">STATUS:</span>
                <span className="font-[800] uppercase text-[#111827]">{viewDetailsItem.status}</span>
              </div>
              {viewDetailsItem.resolved_at && (
                <div className="flex justify-between">
                  <span className="font-[700] text-[#6B7280]">RESOLVED AT:</span>
                  <span className="font-[600] text-emerald-700">{new Date(viewDetailsItem.resolved_at).toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              {viewDetailsItem.status !== "resolved" && (
                <button
                  onClick={() => {
                    const item = viewDetailsItem;
                    setViewDetailsItem(null);
                    setConfirmAction({ type: "resolve", item });
                  }}
                  className="border-2 border-[#111827] bg-[#4361EE] px-4 py-2 font-body text-xs font-[800] uppercase text-white shadow-[2px_2px_0px_#111827]"
                >
                  Mark as Resolved
                </button>
              )}
              <button
                onClick={() => setViewDetailsItem(null)}
                className="border-2 border-[#111827] bg-white px-4 py-2 font-body text-xs font-[800] uppercase text-[#111827] shadow-[2px_2px_0px_#111827]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className="h-2 w-2 bg-[#E63946]" />
          <span className="font-body text-xs font-[800] uppercase tracking-[0.16em] text-[#111827]">
            Incident Management / Moderation Table
          </span>
        </div>

        <h1 className="font-display text-[clamp(2.5rem,4.5vw,4.5rem)] font-[800] uppercase leading-[0.95] tracking-[-0.02em] text-[#111827]">
          Manage Reports
        </h1>
        <p className="mt-2 max-w-2xl font-body text-[14px] font-[500] text-[#4B5563]">
          Audit, filter, and resolve all reported lost and found cases. Confirm custody transfers and maintain accurate database resolution timestamps.
        </p>
      </div>

      {/* Control Filter Bar */}
      <div className="border-2 border-[#111827] bg-white/80 p-6 backdrop-blur-xl shadow-[6px_6px_0px_#111827] space-y-4">
        {/* Search Input */}
        <div>
          <label className="mb-2 block font-body text-[10px] font-[800] uppercase tracking-[0.14em] text-[#374151]">
            Search Reports by Title, Description, Location, or Reporter
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search keywords, students (e.g. 'Adarsh', 'AJCE001', 'Calculator')..."
            className="
              w-full border-2 border-[#111827] bg-white px-4 py-2.5
              font-body text-[13px] font-[500] text-[#111827] outline-none
              placeholder:text-gray-400 focus:border-[#4361EE]
            "
          />
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="mb-1 block font-body text-[10px] font-[800] uppercase tracking-[0.14em] text-[#374151]">
              Report Type
            </label>
            <div className="flex border-2 border-[#111827] bg-white">
              {["all", "lost", "found"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTypeFilter(t)}
                  className={`
                    flex-1 py-1.5 font-body text-[10px] font-[800] uppercase tracking-wider transition-all
                    ${
                      typeFilter === t
                        ? t === "lost"
                          ? "bg-[#E63946] text-white"
                          : t === "found"
                          ? "bg-[#4361EE] text-white"
                          : "bg-[#111827] text-white"
                        : "bg-transparent text-[#374151] hover:bg-gray-100"
                    }
                  `}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block font-body text-[10px] font-[800] uppercase tracking-[0.14em] text-[#374151]">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border-2 border-[#111827] bg-white px-3 py-2 font-body text-[12px] font-[700] uppercase text-[#111827]"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="resolved">Resolved Only</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block font-body text-[10px] font-[800] uppercase tracking-[0.14em] text-[#374151]">
              Sort Order
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full border-2 border-[#111827] bg-white px-3 py-2 font-body text-[12px] font-[700] uppercase text-[#111827]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          <div>
            <button
              onClick={handleResetFilters}
              className="
                w-full border-2 border-[#111827] bg-white py-2 px-3
                font-body text-[11px] font-[800] uppercase tracking-[0.08em] text-[#111827]
                shadow-[2px_2px_0px_#111827] hover:shadow-none transition-all
              "
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Reports Data Table */}
      <div className="flex items-center justify-between border-b-2 border-[#111827]/15 pb-2">
        <p className="font-body text-xs font-[800] uppercase tracking-[0.14em] text-[#111827]">
          Showing {filteredReports.length} of {items.length} Reports
        </p>
      </div>

      {isLoading ? (
        <div className="border-2 border-dashed border-[#111827] bg-white/60 p-16 text-center backdrop-blur-xl">
          <p className="font-display text-2xl font-[800] uppercase text-[#111827]">
            Loading Moderation Table...
          </p>
        </div>
      ) : error ? (
        <div className="border-2 border-[#E63946] bg-[#E63946]/10 p-6 text-center">
          <p className="font-body text-xs font-[800] uppercase text-[#E63946]">
            Error loading reports: {error}
          </p>
        </div>
      ) : filteredReports.length > 0 ? (
        <div className="overflow-x-auto border-2 border-[#111827] bg-white/80 shadow-[6px_6px_0px_#111827] backdrop-blur-xl">
          <table className="w-full text-left font-body min-w-[850px]">
            <thead className="bg-[#F3F4F1] border-b-2 border-[#111827] text-[#111827]">
              <tr>
                <th className="p-4 text-[10px] font-[800] uppercase tracking-[0.14em]">Report ID</th>
                <th className="p-4 text-[10px] font-[800] uppercase tracking-[0.14em]">Item Title</th>
                <th className="p-4 text-[10px] font-[800] uppercase tracking-[0.14em]">Type</th>
                <th className="p-4 text-[10px] font-[800] uppercase tracking-[0.14em]">Reported By</th>
                <th className="p-4 text-[10px] font-[800] uppercase tracking-[0.14em]">Location</th>
                <th className="p-4 text-[10px] font-[800] uppercase tracking-[0.14em]">Date</th>
                <th className="p-4 text-[10px] font-[800] uppercase tracking-[0.14em]">Status</th>
                <th className="p-4 text-right text-[10px] font-[800] uppercase tracking-[0.14em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 border-[#111827]/15">
              {filteredReports.map((item) => {
                const isLost = item.type === "lost";
                const isResolved = item.status === "resolved";

                return (
                  <tr
                    key={item.id}
                    className={`
                      transition-colors
                      ${isResolved ? "bg-gray-50/70" : "hover:bg-white"}
                    `}
                  >
                    <td className="p-4 font-body text-[12px] font-[700] text-[#6B7280]">
                      #{String(item.id).padStart(4, "0")}
                    </td>

                    <td className="p-4 max-w-xs">
                      <p
                        className={`font-display text-[14px] font-[800] uppercase tracking-wide ${
                          isResolved ? "line-through text-gray-500" : "text-[#111827]"
                        }`}
                      >
                        {item.title}
                      </p>
                      <p className="font-body text-[11px] text-[#4B5563] truncate">
                        {item.description}
                      </p>
                    </td>

                    <td className="p-4">
                      <span
                        className={`
                          border-2 px-2.5 py-1 text-[9px] font-[800] uppercase tracking-[0.12em]
                          ${
                            isLost
                              ? "border-[#E63946] bg-[#E63946] text-white"
                              : "border-[#4361EE] bg-[#4361EE] text-white"
                          }
                        `}
                      >
                        {item.type}
                      </span>
                    </td>

                    <td className="p-4">
                      <p className="font-body text-[12px] font-[700] text-[#111827]">
                        {item.reporter_name || "Unknown"}
                      </p>
                      <p className="font-body text-[10px] text-[#6B7280]">
                        {item.student_id || "N/A"}
                      </p>
                    </td>

                    <td className="p-4 font-body text-[12px] font-[600] text-[#111827]">
                      {item.location}
                    </td>

                    <td className="p-4 font-body text-[12px] font-[500] text-[#6B7280]">
                      {item.date}
                    </td>

                    <td className="p-4">
                      <span
                        className={`
                          border-2 px-2.5 py-1 text-[9px] font-[800] uppercase tracking-[0.1em]
                          ${
                            isResolved
                              ? "border-gray-500 bg-gray-200 text-gray-700"
                              : "border-[#111827] bg-emerald-100 text-emerald-800"
                          }
                        `}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {/* View Details */}
                        <button
                          type="button"
                          onClick={() => setViewDetailsItem(item)}
                          className="
                            border-2 border-[#111827] bg-white px-2.5 py-1
                            font-body text-[10px] font-[800] uppercase tracking-[0.06em] text-[#111827]
                            shadow-[2px_2px_0px_#111827] hover:shadow-none transition-all
                          "
                        >
                          View
                        </button>

                        {/* Resolve Action */}
                        {!isResolved && (
                          <button
                            type="button"
                            onClick={() => setConfirmAction({ type: "resolve", item })}
                            className="
                              border-2 border-[#111827] bg-[#4361EE] px-2.5 py-1
                              font-body text-[10px] font-[800] uppercase tracking-[0.06em] text-white
                              shadow-[2px_2px_0px_#111827] hover:shadow-none transition-all
                            "
                          >
                            Resolve
                          </button>
                        )}

                        {/* Delete Action */}
                        <button
                          type="button"
                          onClick={() => setConfirmAction({ type: "delete", item })}
                          className="
                            border-2 border-[#111827] bg-[#E63946] px-2 py-1
                            font-body text-[10px] font-[800] uppercase tracking-[0.06em] text-white
                            shadow-[2px_2px_0px_#111827] hover:shadow-none transition-all
                          "
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="border-2 border-dashed border-[#111827] bg-white/60 p-16 text-center backdrop-blur-xl">
          <p className="font-display text-2xl font-[800] uppercase text-[#111827]/40">
            No reports match criteria
          </p>
          <p className="mt-2 font-body text-sm text-[#6B7280]">
            Try clearing filters or search terms.
          </p>
          <button
            onClick={handleResetFilters}
            className="
              mt-6 border-2 border-[#111827] bg-white px-5 py-2.5
              font-body text-xs font-[800] uppercase tracking-wider text-[#111827]
              shadow-[3px_3px_0px_#111827] hover:shadow-none transition-all
            "
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
