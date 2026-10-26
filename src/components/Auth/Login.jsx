import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async (loginEmail, loginPassword) => {
    setIsSubmitting(true);
    clearError();

    const user = await login(loginEmail, loginPassword);

    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }

    setIsSubmitting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleAuth(email, password);
  };

  // Quick Demo Access handlers: populates credentials and clears any existing error
  const handleSelectDemo = (demoEmail, demoPassword) => {
    clearError();
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div
        className="
          w-full max-w-md
          border-2 border-[#111827]
          bg-white/60
          p-8
          backdrop-blur-xl
          shadow-[8px_8px_0px_#4361EE]
        "
      >
        <div className="mb-8 text-center">
          <p className="font-display text-[32px] font-[800] uppercase tracking-[-0.01em] text-[#111827]">
            REPORT<span className="text-[#4361EE]">_IT</span>
          </p>
          <p className="mt-2 font-body text-xs font-[700] uppercase tracking-[0.14em] text-[#374151]">
            System Access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="border-2 border-[#111827] bg-[#E63946] p-3 text-center">
              <p className="font-body text-[11px] font-[800] uppercase tracking-[0.08em] text-white">
                {error}
              </p>
            </div>
          )}

          <div>
            <label className="mb-2 block font-body text-[10px] font-[700] uppercase tracking-[0.14em] text-[#374151]">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your academic email"
              className="
                w-full
                border-2 border-[#111827]
                bg-white
                px-4 py-3
                font-body text-[14px] font-[500] leading-[1.4] tracking-normal
                text-[#111827]
                outline-none
                backdrop-blur-xl
                placeholder:text-gray-500
                focus:border-[#4361EE]
              "
            />
          </div>

          <div>
            <label className="mb-2 block font-body text-[10px] font-[700] uppercase tracking-[0.14em] text-[#374151]">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="
                w-full
                border-2 border-[#111827]
                bg-white
                px-4 py-3
                font-body text-[14px] font-[500] leading-[1.4] tracking-normal
                text-[#111827]
                outline-none
                backdrop-blur-xl
                placeholder:text-gray-500
                focus:border-[#4361EE]
              "
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="
              mt-6
              w-full
              border-2 border-[#111827]
              bg-white
              px-5 py-4
              font-body text-[12px]
              font-[800]
              uppercase
              tracking-[0.08em]
              text-[#111827]
              shadow-[5px_5px_0px_#111827]
              transition-all
              hover:translate-x-[2px]
              hover:translate-y-[2px]
              hover:shadow-none
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {isSubmitting ? "Authenticating..." : "Authorize"}
          </button>
        </form>

        {/* Quick Demo Access Section */}
        <div className="mt-8 border-t-2 border-[#111827]/15 pt-6">
          <div className="mb-3 text-center">
            <p className="font-body text-[11px] font-[800] uppercase tracking-[0.16em] text-[#111827]">
              QUICK DEMO ACCESS
            </p>
            <p className="mt-0.5 font-body text-[10px] font-[500] text-[#6B7280]">
              Click to autofill role-specific credentials
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSelectDemo("student@reportit.edu", "student")}
              className="
                border-2 border-[#111827]
                bg-[#4361EE]
                px-4 py-3
                font-body text-[11px]
                font-[800]
                uppercase
                tracking-[0.08em]
                text-white
                shadow-[4px_4px_0px_#111827]
                transition-all
                hover:translate-x-[2px]
                hover:translate-y-[2px]
                hover:shadow-none
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              LOGIN AS STUDENT
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSelectDemo("admin@reportit.edu", "admin")}
              className="
                border-2 border-[#111827]
                bg-[#E63946]
                px-4 py-3
                font-body text-[11px]
                font-[800]
                uppercase
                tracking-[0.08em]
                text-white
                shadow-[4px_4px_0px_#111827]
                transition-all
                hover:translate-x-[2px]
                hover:translate-y-[2px]
                hover:shadow-none
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              LOGIN AS ADMIN
            </button>
          </div>

          <p className="mt-4 text-center font-body text-[10px] font-[700] uppercase tracking-[0.14em] text-gray-500">
            Student: student@reportit.edu / student
            <br />
            Admin: admin@reportit.edu / admin
          </p>
        </div>
      </div>
    </div>
  );
}
