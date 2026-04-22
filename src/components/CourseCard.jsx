import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { BookOpen, Users, ChevronRight } from 'lucide-react';
import { getCourseColor } from '../utils/helpers';

const CourseCard = ({ course }) => {
  const { assignments, users, currentUser } = useAppContext();
  const colors = getCourseColor(course.color);
  const courseAssignments = assignments.filter((a) => a.courseId === course.id);
  const professor = users.find((u) => u.id === course.professorId);

  return (
    <Link
      to={`/course/${course.id}`}
      className="group block bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border-light)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 transition-all"
    >
      {/* Color accent */}
      <div className={`h-1.5 rounded-t-xl bg-gradient-to-r ${colors.gradient}`} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${colors.bg} ${colors.text}`}>
            {course.code}
          </span>
          <ChevronRight size={16} className="text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
        </div>

        <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-1 group-hover:text-[var(--color-primary)] transition-colors">
          {course.name}
        </h3>
        <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 mb-4">
          {course.description}
        </p>

        <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
          <span className="flex items-center gap-1.5">
            <BookOpen size={13} />
            {courseAssignments.length} assignments
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={13} />
            {course.studentIds.length} students
          </span>
        </div>

        {currentUser?.role === 'student' && professor && (
          <p className="text-xs text-[var(--color-text-muted)] mt-3 pt-3 border-t border-[var(--color-border-light)]">
            {professor.name}
          </p>
        )}
      </div>
    </Link>
  );
};

export default CourseCard;
