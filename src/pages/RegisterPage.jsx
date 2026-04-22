import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { GraduationCap, User, Mail, Lock, BookOpen, UserCheck } from 'lucide-react';
import { cn } from '../utils/cn';

const RegisterPage = () => {
  const { register } = useAppContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register(formData);
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
        <div className="bg-[var(--color-bg-card)] rounded-2xl shadow-[var(--shadow-lg)] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-[var(--color-primary)] to-indigo-700 px-6 sm:px-8 py-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-4">
              <GraduationCap size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Create an account</h1>
            <p className="text-indigo-200 text-sm mt-1">Join JOineazy today</p>
          </div>

          {/* Form */}
          <div className="px-6 sm:px-8 py-8">
            {error && (
              <div className="mb-4 px-4 py-3 rounded-lg bg-[var(--color-danger-light)] text-[var(--color-danger)] text-sm">
                {error}
              </div>
            )}

            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { value: 'student', label: 'Student', icon: BookOpen, desc: 'View & submit assignments' },
                { value: 'professor', label: 'Professor', icon: UserCheck, desc: 'Create & manage courses' },
              ].map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: role.value })}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center',
                    formData.role === role.value
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)]'
                      : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]'
                  )}
                >
                  <role.icon size={22} className={formData.role === role.value ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'} />
                  <span className={cn('text-sm font-medium', formData.role === role.value ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-primary)]')}>
                    {role.label}
                  </span>
                  <span className="text-[11px] text-[var(--color-text-muted)]">{role.desc}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-shadow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Min. 6 characters"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-shadow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Re-enter your password"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-shadow"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-[var(--color-primary)] font-medium hover:underline">
                Sign in
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

export default RegisterPage;
