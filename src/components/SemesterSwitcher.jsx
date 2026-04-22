import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Calendar, ChevronDown, Check } from 'lucide-react';
import { cn } from '../utils/cn';

const SemesterSwitcher = () => {
  const { activeSemester, setActiveSemester, initialSemesters, courses, currentUser } = useAppContext();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);
  const getCourseCount = (sem) => {
    return courses.filter((c) => {
      if (c.semester !== sem) return false;
      if (!currentUser) return false;
      if (currentUser.role === 'professor') return c.professorId === currentUser.id;
      return c.studentIds.includes(currentUser.id);
    }).length;
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-colors"
      >
        <Calendar size={16} className="text-[var(--color-text-muted)]" />
        <span className="flex-1 text-left">{activeSemester}</span>
        <ChevronDown size={14} className={cn('text-[var(--color-text-muted)] transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          role="listbox"
          onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); }}
          className="absolute left-0 right-0 mt-1 bg-[var(--color-bg-card)] rounded-xl shadow-lg border border-[var(--color-border)] z-20 py-1 animate-fade-in"
        >
          {initialSemesters.map((sem) => (
            <button
              role="option"
              key={sem}
              onClick={() => { setActiveSemester(sem); setOpen(false); }}
              className={cn(
                'flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors',
                activeSemester === sem
                  ? 'bg-[var(--color-primary-subtle)] text-[var(--color-primary)] font-medium'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'
              )}
            >
              {activeSemester === sem && <Check size={14} />}
              <span className={activeSemester !== sem ? 'ml-[22px]' : ''}>{sem}</span>
              <span className="ml-auto text-xs text-[var(--color-text-muted)]">
                {getCourseCount(sem)} courses
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SemesterSwitcher;
