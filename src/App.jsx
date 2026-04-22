import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import AppShell from './components/layout/AppShell';
import ErrorBoundary from './components/ErrorBoundary';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CoursePage from './pages/CoursePage';
import NotFoundPage from './pages/NotFoundPage';

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-app)]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center animate-pulse">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 6 3 12 0v-5" />
        </svg>
      </div>
      <p className="text-sm text-[var(--color-text-muted)]">Loading...</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAppContext();
  if (loading) return <LoadingScreen />;
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { currentUser, loading } = useAppContext();
  if (loading) return <LoadingScreen />;
  if (currentUser) return <Navigate to="/" replace />;
  return children;
};

const App = () => {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/course/:courseId" element={<CoursePage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
