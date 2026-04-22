import { Menu, GraduationCap, Bell } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const MobileNav = ({ onMenuOpen }) => {
  const { currentUser, assignments, acknowledgments, getCoursesForUser } = useAppContext();

  const pendingCount = (() => {
    if (!currentUser || currentUser.role !== 'student') return 0;
    const courses = getCoursesForUser();
    return courses.reduce((total, course) => {
      const courseAssignments = assignments.filter((a) => a.courseId === course.id);
      const unacked = courseAssignments.filter(
        (a) => !acknowledgments.find((ack) => ack.assignmentId === a.id && ack.studentId === currentUser.id)
      ).length;
      return total + unacked;
    }, 0);
  })();

  return (
    <header className="sticky top-0 z-30 bg-[var(--color-bg-card)]/90 backdrop-blur-xl border-b border-[var(--color-border-light)] px-4 h-14 flex items-center gap-3">
      <button
        onClick={onMenuOpen}
        aria-label="Open menu"
        className="p-2 -ml-1 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors"
      >
        <Menu size={20} className="text-[var(--color-text-secondary)]" />
      </button>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
          <GraduationCap size={14} className="text-white" />
        </div>
        <span className="text-sm font-bold text-[var(--color-text-primary)] tracking-tight">JOineazy</span>
      </div>
      {currentUser?.role === 'student' && pendingCount > 0 && (
        <div className="ml-auto relative">
          <Bell size={20} className="text-[var(--color-text-secondary)]" />
          <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--color-danger)] text-white text-[10px] font-bold">
            {pendingCount}
          </span>
        </div>
      )}
    </header>
  );
};

export default MobileNav;
