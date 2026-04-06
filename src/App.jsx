import { useAppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import ToastContainer from './components/ToastContainer';
import LoadingSpinner from './components/LoadingSpinner';
import StudentDashboard from './components/student/StudentDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import { ErrorBoundary } from './ErrorBoundary';

const App = () => {
  const { currentUser, loading } = useAppContext();

  if (!currentUser && loading) {
    return <LoadingSpinner fullScreen message="Loading AssignDash..." />;
  }

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
      <Navbar />

      <ToastContainer />

      <main className="flex-1">
        <ErrorBoundary>
          {isAdmin ? <AdminDashboard /> : <StudentDashboard />}
        </ErrorBoundary>
      </main>

    </div>
  );
};

export default App;
