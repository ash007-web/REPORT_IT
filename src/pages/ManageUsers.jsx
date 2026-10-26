import { useState, useEffect, useMemo, useCallback } from "react";

const USERS_API = "http://localhost:5000/api/users";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all"); // "all" | "student" | "admin"

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(USERS_API);
      if (!response.ok) {
        throw new Error("Failed to fetch users from server");
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Fetch users error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (roleFilter !== "all") {
      result = result.filter((u) => u.role === roleFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (u) =>
          u.name?.toLowerCase().includes(term) ||
          u.student_id?.toLowerCase().includes(term)
      );
    }

    return result;
  }, [users, roleFilter, searchTerm]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className="h-2 w-2 bg-[#4361EE]" />
          <span className="font-body text-xs font-[800] uppercase tracking-[0.16em] text-[#111827]">
            User Directory / Identity Moderation
          </span>
        </div>

        <h1 className="font-display text-[clamp(2.5rem,4.5vw,4.5rem)] font-[800] uppercase leading-[0.95] tracking-[-0.02em] text-[#111827]">
          Manage Users
        </h1>
        <p className="mt-2 max-w-2xl font-body text-[14px] font-[500] text-[#4B5563]">
          Audit registered campus identities, verify student credentials, and review user roles. Password hashes and credentials remain strictly concealed.
        </p>
      </div>

      {/* Control Filter Bar */}
      <div className="border-2 border-[#111827] bg-white/80 p-6 backdrop-blur-xl shadow-[6px_6px_0px_#111827] space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-4">
          <div>
            <label className="mb-1 block font-body text-[10px] font-[800] uppercase tracking-[0.14em] text-[#374151]">
              Search by Student Name or Student ID
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search e.g. 'Adarsh', 'AJCE001', 'Admin'..."
              className="
                w-full border-2 border-[#111827] bg-white px-4 py-2.5
                font-body text-[13px] font-[500] text-[#111827] outline-none
                placeholder:text-gray-400 focus:border-[#4361EE]
              "
            />
          </div>

          <div>
            <label className="mb-1 block font-body text-[10px] font-[800] uppercase tracking-[0.14em] text-[#374151]">
              Filter by Role
            </label>
            <div className="flex border-2 border-[#111827] bg-white">
              {["all", "student", "admin"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRoleFilter(r)}
                  className={`
                    flex-1 py-2 font-body text-[10px] font-[800] uppercase tracking-wider transition-all
                    ${
                      roleFilter === r
                        ? "bg-[#111827] text-white"
                        : "bg-transparent text-[#374151] hover:bg-gray-100"
                    }
                  `}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between border-b-2 border-[#111827]/15 pb-2">
        <p className="font-body text-xs font-[800] uppercase tracking-[0.14em] text-[#111827]">
          Showing {filteredUsers.length} of {users.length} Registered Accounts
        </p>

        <button
          onClick={fetchUsers}
          className="font-body text-[10px] font-[800] uppercase tracking-[0.08em] text-[#4361EE] hover:underline"
        >
          ↻ Refresh Records
        </button>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="border-2 border-dashed border-[#111827] bg-white/60 p-16 text-center backdrop-blur-xl">
          <p className="font-display text-2xl font-[800] uppercase text-[#111827]">
            Querying User Database...
          </p>
        </div>
      ) : error ? (
        <div className="border-2 border-[#E63946] bg-[#E63946]/10 p-6 text-center">
          <p className="font-body text-xs font-[800] uppercase text-[#E63946]">
            Failed to retrieve users: {error}
          </p>
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="overflow-x-auto border-2 border-[#111827] bg-white/80 shadow-[6px_6px_0px_#111827] backdrop-blur-xl">
          <table className="w-full text-left font-body min-w-[700px]">
            <thead className="bg-[#F3F4F1] border-b-2 border-[#111827] text-[#111827]">
              <tr>
                <th className="p-4 text-[10px] font-[800] uppercase tracking-[0.14em]">User ID</th>
                <th className="p-4 text-[10px] font-[800] uppercase tracking-[0.14em]">Student / System ID</th>
                <th className="p-4 text-[10px] font-[800] uppercase tracking-[0.14em]">Full Name</th>
                <th className="p-4 text-[10px] font-[800] uppercase tracking-[0.14em]">Role</th>
                <th className="p-4 text-[10px] font-[800] uppercase tracking-[0.14em]">Account Creation Date</th>
                <th className="p-4 text-right text-[10px] font-[800] uppercase tracking-[0.14em]">Clearance</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 border-[#111827]/15">
              {filteredUsers.map((u) => {
                const isAdmin = u.role === "admin";
                const createdDate = u.created_at ? new Date(u.created_at).toLocaleDateString() : "N/A";

                return (
                  <tr key={u.id} className="hover:bg-white transition-colors">
                    <td className="p-4 font-body text-[12px] font-[700] text-[#6B7280]">
                      #{String(u.id).padStart(4, "0")}
                    </td>

                    <td className="p-4 font-body text-[13px] font-[800] text-[#111827]">
                      {u.student_id}
                    </td>

                    <td className="p-4 font-display text-[15px] font-[800] uppercase text-[#111827]">
                      {u.name}
                    </td>

                    <td className="p-4">
                      <span
                        className={`
                          border-2 px-2.5 py-1 text-[9px] font-[800] uppercase tracking-[0.12em]
                          ${
                            isAdmin
                              ? "border-[#E63946] bg-[#E63946] text-white"
                              : "border-[#4361EE] bg-[#4361EE] text-white"
                          }
                        `}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="p-4 font-body text-[12px] font-[500] text-[#4B5563]">
                      {createdDate}
                    </td>

                    <td className="p-4 text-right">
                      <span className="font-body text-[11px] font-[700] text-emerald-700">
                        ✓ Verified Account
                      </span>
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
            No users match query
          </p>
          <p className="mt-2 font-body text-sm text-[#6B7280]">
            Try adjusting search terms or role filters.
          </p>
        </div>
      )}
    </div>
  );
}
