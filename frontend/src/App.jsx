import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import AdminCreateMatchPage from "./pages/AdminCreateMatchPage.jsx";
import AdminCreateRefereePage from "./pages/AdminCreateRefereePage.jsx";
import AdminMatchesPage from "./pages/AdminMatchesPage.jsx";
import AdminRefereesPage from "./pages/AdminRefereesPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import RefereeMatchesPage from "./pages/RefereeMatchesPage.jsx";
import RefereeProfilePage from "./pages/RefereeProfilePage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import SubmitResultPage from "./pages/SubmitResultPage.jsx";

function DashboardRedirect() {
    const auth = useAuth();

    if (!auth.isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return auth.user?.role === "admin" ? (
        <Navigate to="/matches" replace />
    ) : (
        <Navigate to="/my-matches" replace />
    );
}

export default function App() {
    return (
        <Routes>
            <Route element={<HomePage />} path="/" />
            <Route element={<LoginPage />} path="/login" />
            <Route element={<RegisterPage />} path="/register" />
            <Route element={<DashboardRedirect />} path="/dashboard" />

            <Route
                element={
                    <ProtectedRoute role="admin">
                        <AdminMatchesPage />
                    </ProtectedRoute>
                }
                path="/matches"
            />
            <Route
                element={
                    <ProtectedRoute role="admin">
                        <AdminCreateMatchPage />
                    </ProtectedRoute>
                }
                path="/create-match"
            />
            <Route
                element={
                    <ProtectedRoute role="admin">
                        <AdminRefereesPage />
                    </ProtectedRoute>
                }
                path="/referees"
            />
            <Route
                element={
                    <ProtectedRoute role="admin">
                        <AdminCreateRefereePage />
                    </ProtectedRoute>
                }
                path="/create-referee"
            />

            <Route
                element={
                    <ProtectedRoute role="referee">
                        <RefereeMatchesPage />
                    </ProtectedRoute>
                }
                path="/my-matches"
            />
            <Route
                element={
                    <ProtectedRoute role="referee">
                        <RefereeProfilePage />
                    </ProtectedRoute>
                }
                path="/my-profile"
            />
            <Route
                element={
                    <ProtectedRoute role="referee">
                        <SubmitResultPage />
                    </ProtectedRoute>
                }
                path="/submit-result/:matchId"
            />

            <Route element={<NotFoundPage />} path="*" />
        </Routes>
    );
}