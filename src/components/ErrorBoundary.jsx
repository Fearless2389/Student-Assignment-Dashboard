import { Component } from 'react';
import { GraduationCap } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--color-bg-app)] flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="w-14 h-14 rounded-2xl bg-[var(--color-danger-light)] flex items-center justify-center mx-auto mb-4">
              <GraduationCap size={28} className="text-[var(--color-danger)]" />
            </div>
            <h1 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">Something went wrong</h1>
            <p className="text-sm text-[var(--color-text-muted)] mb-6">An unexpected error occurred. Please refresh the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-medium transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
