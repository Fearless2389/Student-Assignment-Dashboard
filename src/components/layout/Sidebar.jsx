import { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, GraduationCap, LogOut, X, ChevronRight, Moon, Sun } from 'lucide-react';
import { cn } from '../../utils/cn';
import SemesterSwitcher from '../SemesterSwitcher';

const Sidebar = ({ mobile = false, isOpen = false, onClose }) => {
  const { currentUser, logout, getCoursesForUser, assignments, acknowledgments, darkMode, toggleDarkMode } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const courses = getCoursesForUser();

  useEffect(() => {
    if (!isOpen || !mobile) return;
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, mobile, onClose]);

  if (!currentUser) return null;

  const isProfessor = currentUser.role === 'professor';

  const getTotalPendingCount = () => {
    if (isProfessor) return 0;
    return courses.reduce((total, course) => {
      const courseAssignments = assignments.filter((a) => a.courseId === course.id);
      const unacked = courseAssignments.filter(
        (a) => !acknowledgments.find((ack) => ack.assignmentId === a.id && ack.studentId === currentUser.id)
      ).length;
      return total + unacked;
    }, 0);
  };
  const totalPendingCount = getTotalPendingCount();

  const getPendingCount = (courseId) => {
    const courseAssignments = assignments.filter((a) => a.courseId === courseId);
    if (isProfessor) {
      const course = courses.find((c) => c.id === courseId);
      if (!course) return 0;
      return courseAssignments.filter((a) => {
        const totalStudents = course.studentIds.length;
        if (totalStudents === 0) return false;
        const ackedCount = course.studentIds.filter((sid) =>
          acknowledgments.find((ack) => ack.assignmentId === a.id && ack.studentId === sid)
        ).length;
        return ackedCount < totalStudents;
      }).length;
    } else {
      return courseAssignments.filter(
        (a) => !acknowledgments.find((ack) => ack.assignmentId === a.id && ack.studentId === currentUser.id)
      ).length;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;
  const isCourseActive = (id) => location.pathname.startsWith(`/course/${id}`);

  const courseColorDot = {
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    violet: 'bg-violet-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    sky: 'bg-sky-500',
  };

  const content = (
    <div className="flex flex-col h-full bg-[var(--color-bg-card)]">
      {/* Logo */}
      <div className="px-5 h-16 flex items-center gap-3 border-b border-[var(--color-border-light)] shrink-0">
        <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] flex items-center justify-center">
          <GraduationCap size={18} className="text-white" />
        </div>
        <span className="text-lg font-bold text-[var(--color-text-primary)] tracking-tight">JOineazy</span>
        {mobile && (
          <button onClick={onClose} className="ml-auto p-1.5 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors">
            <X size={18} className="text-[var(--color-text-muted)]" />
          </button>
        )}
      </div>

      {/* Role Badge */}
      <div className="px-5 pt-5 pb-2">
        <span className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold',
          isProfessor
            ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
            : 'bg-[var(--color-success-light)] text-[var(--color-success)]'
        )}>
          {isProfessor ? 'Professor' : 'Student'}
        </span>
      </div>

      {/* Semester Switcher */}
      <div className="px-3 pb-2">
        <SemesterSwitcher />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pt-2 overflow-y-auto">
        <Link
          to="/"
          onClick={onClose}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-1',
            isActive('/')
              ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]'
          )}
        >
          <LayoutDashboard size={18} />
          <span className="flex-1">Dashboard</span>
          {!isProfessor && totalPendingCount > 0 && (
            <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[var(--color-danger)] text-white text-[10px] font-bold shrink-0">
              {totalPendingCount}
            </span>
          )}
        </Link>

        {/* Courses */}
        {courses.length > 0 && (
          <div className="mt-6">
            <p className="px-3 mb-2 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
              {isProfessor ? 'My Courses' : 'Enrolled Courses'}
            </p>
            <div className="space-y-0.5">
              {courses.map((course) => {
                const pendingCount = getPendingCount(course.id);
                return (
                  <Link
                    key={course.id}
                    to={`/course/${course.id}`}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                      isCourseActive(course.id)
                        ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] border-l-3 border-[var(--color-primary)] -ml-px'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]'
                    )}
                  >
                    <div className={cn('w-2.5 h-2.5 rounded-full shrink-0', courseColorDot[course.color] || 'bg-indigo-500')} />
                    <span className="flex-1 truncate">{course.code}</span>
                    {pendingCount > 0 && (
                      <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[var(--color-danger)] text-white text-[10px] font-bold shrink-0">
                        {pendingCount}
                      </span>
                    )}
                    <ChevronRight size={14} className="text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* User Profile & Logout */}
      <div className="px-3 pb-4 pt-2 border-t border-[var(--color-border-light)] mt-auto">
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="w-9 h-9 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center text-xs font-bold text-[var(--color-primary)] shrink-0">
            {currentUser.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">{currentUser.name}</p>
            <p className="text-xs text-[var(--color-text-muted)] truncate">{currentUser.email}</p>
          </div>
        </div>
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-colors"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] transition-colors mt-1"
        >
          <LogOut size={18} />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );

  // Desktop sidebar (non-mobile)
  if (!mobile) {
    return (
      <aside className="h-screen sticky top-0 border-r border-[var(--color-border-light)] overflow-y-auto">
        {content}
      </aside>
    );
  }

  // Mobile drawer
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 left-0 w-[280px] z-50 md:hidden shadow-xl"
          >
            {content}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
