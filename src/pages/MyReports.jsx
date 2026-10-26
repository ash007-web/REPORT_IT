import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useItems } from "../hooks/useItems";

export default function MyReports() {
  const { currentUser } = useAuth();
  // Fetch reports belonging strictly to authenticated user via backend query parameter
  const { items: myItems, isLoading, error, resolveItem, refetch } = useItems(null, currentUser?.id);

  const [activeTab, setActiveTab] = useState("all"); // "all" | "active" | "resolved"

  const filteredItems = useMemo(() => {
    if (activeTab === "active") {
      return myItems.filter((item) => item.status === "active");
    }
    if (activeTab === "resolved") {
      return myItems.filter((item) => item.status === "resolved");
    }
    return myItems;
  }, [myItems, activeTab]);

  const activeCount = myItems.filter((i) => i.status === "active").length;
  const resolvedCount = myItems.filter((i) => i.status === "resolved").length;

  const handleResolve = async (id) => {
    try {
      await resolveItem(id);
      refetch();
    } catch (err) {
      console.error("Resolve error:", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-[#111827]/15 pb-6">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 bg-[#4361EE]" />
            <span className="font-body text-xs font-[800] uppercase tracking-[0.16em] text-[#111827]">
              Student Submissions / Case History
            </span>
          </div>

          <h1 className="font-display text-[clamp(2.5rem,4vw,4rem)] font-[800] uppercase leading-[0.95] tracking-[-0.02em] text-[#111827]">
            My Reports
          </h1>
          <p className="mt-2 font-body text-sm font-[500] text-[#4B5563]">
            Track status, update resolution states, and manage your broadcasted lost and found items.
          </p>
        </div>

        <Link
          to="/report"
          className="
            border-2 border-[#111827] bg-[#4361EE] px-5 py-3
            font-body text-[11px] font-[800] uppercase tracking-[0.1em] text-white
            shadow-[3px_3px_0px_#111827] hover:shadow-none transition-all
          "
        >
          + File New Report
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b-2 border-[#111827] pb-3">
        <button
          onClick={() => setActiveTab("all")}
          className={`
            border-2 px-4 py-2 font-body text-[11px] font-[800] uppercase tracking-[0.08em] transition-all
            ${
              activeTab === "all"
                ? "border-[#111827] bg-[#111827] text-white shadow-[2px_2px_0px_#4361EE]"
                : "border-[#111827]/30 bg-white text-[#374151] hover:border-[#111827]"
            }
          `}
        >
          All Cases ({myItems.length})
        </button>

        <button
          onClick={() => setActiveTab("active")}
          className={`
            border-2 px-4 py-2 font-body text-[11px] font-[800] uppercase tracking-[0.08em] transition-all
            ${
              activeTab === "active"
                ? "border-[#111827] bg-[#E63946] text-white shadow-[2px_2px_0px_#111827]"
                : "border-[#111827]/30 bg-white text-[#374151] hover:border-[#111827]"
            }
          `}
        >
          Active Incidents ({activeCount})
        </button>

        <button
          onClick={() => setActiveTab("resolved")}
          className={`
            border-2 px-4 py-2 font-body text-[11px] font-[800] uppercase tracking-[0.08em] transition-all
            ${
              activeTab === "resolved"
                ? "border-[#111827] bg-gray-600 text-white shadow-[2px_2px_0px_#111827]"
                : "border-[#111827]/30 bg-white text-[#374151] hover:border-[#111827]"
            }
          `}
        >
          Resolved Cases ({resolvedCount})
        </button>
      </div>

      {/* Reports Table / Card View */}
      {isLoading ? (
        <div className="border-2 border-dashed border-[#111827] bg-white/60 p-16 text-center backdrop-blur-xl">
          <p className="font-display text-xl font-[800] uppercase text-[#111827]">
            Loading your incident records...
          </p>
        </div>
      ) : error ? (
        <div className="border-2 border-[#E63946] bg-[#E63946]/10 p-6 text-center">
          <p className="font-body text-xs font-[800] uppercase text-[#E63946]">
            Error loading your reports: {error}
          </p>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="overflow-x-auto border-2 border-[#111827] bg-white/80 shadow-[6px_6px_0px_#111827] backdrop-blur-xl">
          <table className="w-full text-left font-body min-w-[700px]">
            <thead className="bg-[#F3F4F1] border-b-2 border-[#111827] text-[#111827]">
              <tr>
                <th className="p-4 text-[10px] font-[800] uppercase tracking-[0.14em]">Report ID</th>
                <th className="p-4 text-[10px] font-[800] uppercase tracking-[0.14em]">Type</th>
                <th className="p-4 text-[10px] font-[800] uppercase tracking-[0.14em]">Item Details</th>
                <th className="p-4 text-[10px] font-[800] uppercase tracking-[0.14em]">Location</th>
                <th className="p-4 text-[10px] font-[800] uppercase tracking-[0.14em]">Date</th>
                <th className="p-4 text-[10px] font-[800] uppercase tracking-[0.14em]">Status</th>
                <th className="p-4 text-right text-[10px] font-[800] uppercase tracking-[0.14em]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 border-[#111827]/15">
              {filteredItems.map((item) => {
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

                    <td className="p-4 max-w-xs">
                      <p
                        className={`font-display text-[14px] font-[800] uppercase tracking-wide ${
                          isResolved ? "line-through text-gray-500" : "text-[#111827]"
                        }`}
                      >
                        {item.title}
                      </p>
                      <p className="mt-0.5 font-body text-[12px] font-[500] text-[#4B5563] line-clamp-2">
                        {item.description}
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
                      {!isResolved ? (
                        <button
                          type="button"
                          onClick={() => handleResolve(item.id)}
                          className="
                            border-2 border-[#111827] bg-white px-3 py-1.5
                            font-body text-[10px] font-[800] uppercase tracking-[0.08em] text-[#111827]
                            shadow-[2px_2px_0px_#111827] hover:shadow-none transition-all
                          "
                        >
                          Mark Resolved
                        </button>
                      ) : (
                        <span className="font-body text-[11px] font-[700] text-gray-500">
                          ✓ Resolved
                        </span>
                      )}
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
            No incident reports found
          </p>
          <p className="mt-2 font-body text-sm text-[#6B7280]">
            You have not submitted any {activeTab !== "all" ? activeTab : ""} lost or found reports yet.
          </p>
          <Link
            to="/report"
            className="
              mt-6 inline-block border-2 border-[#111827] bg-white px-5 py-2.5
              font-body text-xs font-[800] uppercase tracking-wider text-[#111827]
              shadow-[3px_3px_0px_#111827] hover:shadow-none transition-all
            "
          >
            Report An Item Now
          </Link>
        </div>
      )}
    </div>
  );
}
