import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import UserProfile from "./pages/UserProfile";
import PublicUserPage from "./pages/PublicUserPage";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<LandingPage />} />

                    <Route
                        path="/login"
                        element={
                            <PublicOnlyRoute>
                                <LoginPage />
                            </PublicOnlyRoute>
                        }
                    />

                    <Route
                        path="/signup"
                        element={
                            <PublicOnlyRoute>
                                <SignUpPage />
                            </PublicOnlyRoute>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <UserProfile />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="/user/:username" element={<PublicUserPage />} />

                    {/* 404 – MUST BE LAST */}
                    <Route path="*" element={<NotFound />} />

                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
