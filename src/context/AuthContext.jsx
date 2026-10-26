import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("report_it_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [error, setError] = useState(null);

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      error,
      clearError: () => setError(null),

      login: async (email, password) => {
        // Simulated Authentication
        if (email === "student@reportit.edu" && password === "student") {
          const user = {
            id: 1,
            studentId: "AJCE001",
            name: "Adarsh",
            email,
            role: "student",
          };
          setCurrentUser(user);
          try {
            localStorage.setItem("report_it_user", JSON.stringify(user));
          } catch {}
          setError(null);
          return user;
        } else if (email === "admin@reportit.edu" && password === "admin") {
          const user = {
            id: 2,
            studentId: "ADMIN01",
            name: "System Admin",
            email,
            role: "admin",
          };
          setCurrentUser(user);
          try {
            localStorage.setItem("report_it_user", JSON.stringify(user));
          } catch {}
          setError(null);
          return user;
        } else {
          setError("Invalid email or password");
          return null;
        }
      },

      logout: () => {
        setCurrentUser(null);
        try {
          localStorage.removeItem("report_it_user");
        } catch {}
      },
    }),
    [currentUser, error]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
