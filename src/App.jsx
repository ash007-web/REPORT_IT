import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardRouter from "./routes/DashboardRouter";
import Login from "./components/Auth/Login";

import "./index.css";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-campus-background text-campus-text">
        <div className="fixed inset-0 -z-0 bg-campus-mesh" />

        <div
          className="
            fixed inset-0 -z-0
            opacity-[0.035]
            [background-image:linear-gradient(rgba(0,0,0,1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,1)_1px,transparent_1px)]
            [background-size:60px_60px]
          "
        />

        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
