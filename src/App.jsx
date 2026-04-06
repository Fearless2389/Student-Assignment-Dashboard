/**
 * App.jsx
 * 
 * Root application component.
 * Renders the appropriate dashboard based on the current user's role:
 * - Student → StudentDashboard
 * - Admin/Professor → AdminDashboard
 * 
 * Also renders the global Navbar, ToastContainer, and LoadingSpinner.
 */

import { useAppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import ToastContainer from './components/ToastContainer';
import LoadingSpinner from './components/LoadingSpinner';
import StudentDashboard from './components/student/StudentDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import { ErrorBoundary } from './ErrorBoundary';

const App = () => {
  const { currentUser, loading } = useAppContext();

  // Show full-screen loader during initial data load
  if (!currentUser && loading) {
    return <LoadingSpinner fullScreen message="Loading AssignDash..." />;
  }

  // Safety fallback — should not reach here in normal flow
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Unable to load user data. Please refresh.</p>
      </div>
    );
  }

  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Global Navigation */}
      <Navbar />

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Main Content — role-based routing */}
      <main className="flex-1">
        <ErrorBoundary>
          {isAdmin ? <AdminDashboard /> : <StudentDashboard />}
        </ErrorBoundary>
      </main>

    </div>
  );
};

export default App;
