import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => (
  <div className="min-h-screen bg-[var(--color-bg-app)] flex items-center justify-center p-4">
    <div className="text-center max-w-md">
      <p className="text-7xl font-bold text-[var(--color-primary)] mb-4">404</p>
      <h1 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">Page not found</h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-medium transition-colors"
      >
        <Home size={16} />
        Back to Dashboard
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
