import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { LoginPage } from "./components/login-page";
import { RegisterPage } from "./components/register-page";
import { DashboardPage } from "./components/dashboard";
import { FlashcardManager } from "./components/flashcard-manager";
import { StudySession } from "./components/study-session";
import { ProfilePage } from "./components/profile-page";
import { StatsPage } from "./components/stats-page";
import { useAuthStore } from "./lib/store/auth-store";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const token = useAuthStore((state) => state.token);
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
}

export function App() {
    return (
        <HashRouter>
            <Toaster position="top-center" richColors />
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Routes */}
                <Route 
                    path="/dashboard" 
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/flashcards" 
                    element={
                        <ProtectedRoute>
                            <FlashcardManager />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/flashcards/new" 
                    element={
                        <ProtectedRoute>
                            <FlashcardManager />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/study" 
                    element={
                        <ProtectedRoute>
                            <StudySession />
                        </ProtectedRoute>
                    } 
                />

                <Route 
                    path="/profile" 
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    } 
                />

                <Route 
                    path="/stats" 
                    element={
                        <ProtectedRoute>
                            <StatsPage />
                        </ProtectedRoute>
                    } 
                />

                {/* Redirects */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </HashRouter>
    );
}

export default App;