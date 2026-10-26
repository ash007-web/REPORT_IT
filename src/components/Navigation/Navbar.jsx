import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.svg";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [reportDropdownOpen, setReportDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setReportDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinkClass = ({ isActive }) => `
    border-2 px-3.5 py-1.5 font-body text-[11px] font-[800] uppercase tracking-[0.08em] transition-all
    ${
      isActive
        ? "border-[#111827] bg-[#111827] text-white shadow-[2px_2px_0px_#4361EE]"
        : "border-transparent bg-transparent text-[#111827] hover:border-[#111827] hover:bg-white/80"
    }
  `;

  const isAdmin = currentUser?.role === "admin";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-3 pb-2 md:px-8 bg-[#F3F4F1]/90 backdrop-blur-md">
      <nav
        className="
          mx-auto flex max-w-7xl items-center justify-between
          border-2 border-[#111827] bg-white/90 px-4 py-3 md:px-6
          backdrop-blur-xl shadow-[4px_4px_0px_#4361EE]
        "
        aria-label="Main Navigation"
      >
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3 group">
          <div
            className="
              flex h-10 w-10 items-center justify-center
              border-2 border-[#111827] bg-white p-1
              shadow-[3px_3px_0px_#4361EE] transition-transform
              group-hover:scale-105
            "
          >
            <img
              src={logo}
              alt="REPORT_IT Logo"
              className="h-full w-full object-contain"
            />
          </div>

          <div>
            <p className="font-display text-[22px] md:text-[24px] font-[800] uppercase tracking-[-0.01em] leading-tight">
              <span className="text-[#111827]">REPORT</span>
              <span className="text-[#4361EE]">_IT</span>
            </p>
            <p className="hidden md:block font-body text-[9px] font-[700] uppercase tracking-[0.14em] text-[#6B7280]">
              {isAdmin ? "Admin Security Terminal" : "Campus Lost & Found"}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        {currentUser && (
          <div className="hidden lg:flex items-center gap-2">
            {!isAdmin ? (
              /* Student Navigation: Dashboard | Browse Items | Report Item ▾ | My Reports | Profile | Logout */
              <>
                <NavLink to="/dashboard" className={navLinkClass}>
                  Dashboard
                </NavLink>

                <NavLink to="/browse" className={navLinkClass}>
                  Browse Items
                </NavLink>

                {/* Report Item Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setReportDropdownOpen(!reportDropdownOpen)}
                    aria-expanded={reportDropdownOpen}
                    className="
                      flex items-center gap-1.5 border-2 border-transparent px-3.5 py-1.5
                      font-body text-[11px] font-[800] uppercase tracking-[0.08em]
                      text-[#111827] transition-all hover:border-[#111827] hover:bg-white/80
                    "
                  >
                    Report Item
                    <span className="text-[9px] text-[#4361EE]">▾</span>
                  </button>

                  {reportDropdownOpen && (
                    <div
                      className="
                        absolute left-0 mt-2 w-48 border-2 border-[#111827]
                        bg-white p-2 shadow-[4px_4px_0px_#111827] backdrop-blur-xl z-50
                      "
                    >
                      <Link
                        to="/report?type=lost"
                        onClick={() => setReportDropdownOpen(false)}
                        className="
                          flex items-center gap-2 px-3 py-2 text-[11px] font-[800]
                          uppercase tracking-[0.06em] text-[#111827] hover:bg-[#E63946] hover:text-white transition-colors
                        "
                      >
                        <span className="h-2 w-2 bg-[#E63946]" />
                        Report Lost Item
                      </Link>
                      <Link
                        to="/report?type=found"
                        onClick={() => setReportDropdownOpen(false)}
                        className="
                          flex items-center gap-2 px-3 py-2 text-[11px] font-[800]
                          uppercase tracking-[0.06em] text-[#111827] hover:bg-[#4361EE] hover:text-white transition-colors
                        "
                      >
                        <span className="h-2 w-2 bg-[#4361EE]" />
                        Report Found Item
                      </Link>
                    </div>
                  )}
                </div>

                <NavLink to="/my-reports" className={navLinkClass}>
                  My Reports
                </NavLink>

                <NavLink to="/profile" className={navLinkClass}>
                  Profile
                </NavLink>
              </>
            ) : (
              /* Admin Navigation: REPORT_IT | Dashboard | Manage Reports | Manage Users | Profile | Logout */
              <>
                <NavLink to="/admin" className={navLinkClass}>
                  Dashboard
                </NavLink>

                <NavLink to="/admin/reports" className={navLinkClass}>
                  Manage Reports
                </NavLink>

                <NavLink to="/admin/users" className={navLinkClass}>
                  Manage Users
                </NavLink>

                <NavLink to="/profile" className={navLinkClass}>
                  Profile
                </NavLink>
              </>
            )}
          </div>
        )}

        {/* Right User Badge & Logout */}
        {currentUser && (
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right border-l-2 border-[#111827]/15 pl-3">
              <p className="font-body text-[12px] font-[800] leading-tight text-[#111827]">
                {currentUser.name}
              </p>
              <p className="font-body text-[9px] font-[700] uppercase tracking-[0.14em] text-[#6B7280]">
                {isAdmin ? "Administrator" : currentUser.studentId}
              </p>
            </div>

            <div
              className={`h-2.5 w-2.5 border-2 border-[#111827] shadow-[1px_1px_0px_#111827] ${
                isAdmin ? "bg-[#E63946]" : "bg-[#4361EE]"
              }`}
            />

            <button
              onClick={handleLogout}
              className="
                border-2 border-[#111827] bg-white px-3 py-1.5
                font-body text-[10px] font-[800] uppercase tracking-[0.08em]
                text-[#111827] shadow-[2px_2px_0px_#111827] transition-all
                hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none
              "
            >
              Logout
            </button>
          </div>
        )}

        {/* Mobile Menu Button */}
        {currentUser && (
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="
                border-2 border-[#111827] bg-white p-2
                text-[#111827] shadow-[2px_2px_0px_#111827]
              "
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        )}
      </nav>

      {/* Mobile Menu Drawer */}
      {currentUser && mobileMenuOpen && (
        <div
          className="
            lg:hidden mx-auto mt-2 max-w-7xl border-2 border-[#111827]
            bg-white p-5 shadow-[4px_4px_0px_#111827] space-y-4
          "
        >
          <div className="border-b-2 border-[#111827]/10 pb-3 flex justify-between items-center">
            <div>
              <p className="font-body text-[13px] font-[800] text-[#111827]">{currentUser.name}</p>
              <p className="font-body text-[10px] font-[700] uppercase tracking-[0.1em] text-[#6B7280]">
                {isAdmin ? "System Administrator" : currentUser.studentId}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="
                border-2 border-[#111827] bg-[#E63946] px-3 py-1
                font-body text-[10px] font-[800] uppercase tracking-[0.08em] text-white
              "
            >
              Logout
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {!isAdmin ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-2 border-[#111827] p-2.5 font-body text-xs font-[800] uppercase tracking-wider text-[#111827] hover:bg-gray-100"
                >
                  Dashboard
                </Link>
                <Link
                  to="/browse"
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-2 border-[#111827] p-2.5 font-body text-xs font-[800] uppercase tracking-wider text-[#111827] hover:bg-gray-100"
                >
                  Browse Items
                </Link>
                <Link
                  to="/report?type=lost"
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-2 border-[#111827] bg-[#E63946]/10 p-2.5 font-body text-xs font-[800] uppercase tracking-wider text-[#E63946] hover:bg-[#E63946] hover:text-white"
                >
                  Report Lost Item
                </Link>
                <Link
                  to="/report?type=found"
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-2 border-[#111827] bg-[#4361EE]/10 p-2.5 font-body text-xs font-[800] uppercase tracking-wider text-[#4361EE] hover:bg-[#4361EE] hover:text-white"
                >
                  Report Found Item
                </Link>
                <Link
                  to="/my-reports"
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-2 border-[#111827] p-2.5 font-body text-xs font-[800] uppercase tracking-wider text-[#111827] hover:bg-gray-100"
                >
                  My Reports
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-2 border-[#111827] p-2.5 font-body text-xs font-[800] uppercase tracking-wider text-[#111827] hover:bg-gray-100"
                >
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-2 border-[#111827] p-2.5 font-body text-xs font-[800] uppercase tracking-wider text-[#111827]"
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/reports"
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-2 border-[#111827] p-2.5 font-body text-xs font-[800] uppercase tracking-wider text-[#111827]"
                >
                  Manage Reports
                </Link>
                <Link
                  to="/admin/users"
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-2 border-[#111827] p-2.5 font-body text-xs font-[800] uppercase tracking-wider text-[#111827]"
                >
                  Manage Users
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-2 border-[#111827] p-2.5 font-body text-xs font-[800] uppercase tracking-wider text-[#111827]"
                >
                  Profile
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
