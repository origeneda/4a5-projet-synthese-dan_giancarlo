import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children, role }) {
    const auth = useAuth();
    const location = useLocation();

    if (!auth.isLoggedIn) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    if (role && auth.user?.role !== role) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}