import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { GraduationCap, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail) => {
    setError('');
    setLoading(true);
    try {
      await login(demoEmail, 'password123');
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-app)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-[var(--color-bg-card)] rounded-2xl shadow-[var(--shadow-lg)] overflow-hidden">
          {/* Header gradient */}
          <div className="bg-gradient-to-br from-[var(--color-primary)] to-indigo-700 px-6 sm:px-8 py-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-4">
              <GraduationCap size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-indigo-200 text-sm mt-1">Sign in to JOineazy</p>
          </div>

          {/* Form */}
          <div className="px-6 sm:px-8 py-8">
            {error && (
              <div className="mb-4 px-4 py-3 rounded-lg bg-[var(--color-danger-light)] text-[var(--color-danger)] text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@university.edu"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-shadow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-shadow"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            {/* Demo accounts */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--color-border-light)]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-[var(--color-bg-card)] text-[var(--color-text-muted)]">or try a demo account</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <button
                    onClick={() => handleDemoLogin('neha@university.edu')}
                    disabled={loading}
                    className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-colors disabled:opacity-50"
                  >
                    Professor Demo
                  </button>
                  <p className="text-[10px] text-[var(--color-text-muted)] text-center mt-0.5">neha@university.edu</p>
                </div>
                <div>
                  <button
                    onClick={() => handleDemoLogin('ruthvik@student.edu')}
                    disabled={loading}
                    className="w-full px-3 py-2.5 rounded-lg border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-colors disabled:opacity-50"
                  >
                    Student Demo
                  </button>
                  <p className="text-[10px] text-[var(--color-text-muted)] text-center mt-0.5">ruthvik@student.edu</p>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-[var(--color-primary)] font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
        <p className="text-center text-xs text-[var(--color-text-muted)] mt-6">
          Built for JOineazy Assignment Portal
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
