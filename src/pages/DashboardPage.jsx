import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import CourseCard from '../components/CourseCard';
import StatCard from '../components/StatCard';
import AnalyticsPanel from '../components/AnalyticsPanel';
import { BookOpen, CheckCircle, Clock, Users, BarChart3 } from 'lucide-react';
import { getDaysRemaining, getDueDateBadge, formatDate, getCourseColor } from '../utils/helpers';
import { cn } from '../utils/cn';
import DashboardSkeleton from '../components/ui/DashboardSkeleton';

const DashboardPage = () => {
  const { currentUser, getCoursesForUser, assignments, acknowledgments, activeSemester, loading } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');
  const courses = getCoursesForUser();
  const isProfessor = currentUser?.role === 'professor';

  const stats = useMemo(() => {
    if (!currentUser) return {};

    const courseIds = courses.map((c) => c.id);
    const courseAssignments = assignments.filter((a) => courseIds.includes(a.courseId));

    if (isProfessor) {
      const totalStudents = [...new Set(courses.flatMap((c) => c.studentIds))].length;
      const totalAcks = courseAssignments.reduce((acc, a) => {
        const course = courses.find((c) => c.id === a.courseId);
        if (!course) return acc;
        return acc + course.studentIds.filter((sid) =>
          acknowledgments.find((ack) => ack.assignmentId === a.id && ack.studentId === sid)
        ).length;
      }, 0);
      const totalPossible = courseAssignments.reduce((acc, a) => {
        const course = courses.find((c) => c.id === a.courseId);
        return acc + (course ? course.studentIds.length : 0);
      }, 0);

      return {
        courses: courses.length,
        assignments: courseAssignments.length,
        students: totalStudents,
        completionRate: totalPossible > 0 ? Math.round((totalAcks / totalPossible) * 100) : 0,
      };
    } else {
      const myAcks = courseAssignments.filter((a) =>
        acknowledgments.find((ack) => ack.assignmentId === a.id && ack.studentId === currentUser.id)
      ).length;
      const upcoming = courseAssignments
        .filter((a) => {
          const days = getDaysRemaining(a.dueDate);
          return days >= 0 && days <= 7 && !acknowledgments.find((ack) => ack.assignmentId === a.id && ack.studentId === currentUser.id);
        }).length;

      return {
        courses: courses.length,
        total: courseAssignments.length,
        completed: myAcks,
        upcoming,
        pending: courseAssignments.length - myAcks,
      };
    }
  }, [currentUser, courses, assignments, acknowledgments, isProfessor]);

  const upcomingDeadlines = useMemo(() => {
    if (isProfessor || !currentUser) return [];
    const courseIds = courses.map((c) => c.id);
    return assignments
      .filter((a) => {
        if (!courseIds.includes(a.courseId)) return false;
        const days = getDaysRemaining(a.dueDate);
        return days >= 0 && days <= 7 && !acknowledgments.find((ack) => ack.assignmentId === a.id && ack.studentId === currentUser.id);
      })
      .map((a) => {
        const course = courses.find((c) => c.id === a.courseId);
        const days = getDaysRemaining(a.dueDate);
        return { ...a, course, days, badge: getDueDateBadge(days) };
      })
      .sort((a, b) => a.days - b.days)
      .slice(0, 5);
  }, [isProfessor, currentUser, courses, assignments, acknowledgments]);

  if (loading) return <DashboardSkeleton />;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          {getGreeting()}, {currentUser?.name?.split(' ')[0]}
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          {activeSemester} — Here's your overview
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isProfessor ? (
          <>
            <StatCard icon={BookOpen} label="Courses" value={stats.courses} color="primary" />
            <StatCard icon={CheckCircle} label="Assignments" value={stats.assignments} color="success" />
            <StatCard icon={Users} label="Students" value={stats.students} color="info" />
            <StatCard icon={BarChart3} label="Completion" value={`${stats.completionRate}%`} color="warning" />
          </>
        ) : (
          <>
            <StatCard icon={BookOpen} label="Courses" value={stats.courses} color="primary" />
            <StatCard icon={CheckCircle} label="Completed" value={stats.completed} color="success" />
            <StatCard icon={Clock} label="Pending" value={stats.pending} color="warning" />
            <StatCard icon={Clock} label="Due Soon" value={stats.upcoming} color="danger" subtitle="Within 7 days" />
          </>
        )}
      </div>

      {/* Upcoming Deadlines (Students only) */}
      {!isProfessor && upcomingDeadlines.length > 0 && (
        <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border-light)] p-5 mb-8">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Upcoming Deadlines</h2>
          <div className="space-y-3">
            {upcomingDeadlines.map((item) => {
              const courseColors = getCourseColor(item.course?.color);
              const badgeVariant = {
                danger: 'bg-[var(--color-danger-light)] text-[var(--color-danger)]',
                warning: 'bg-[var(--color-warning-light)] text-[var(--color-warning)]',
                success: 'bg-[var(--color-success-light)] text-[var(--color-success)]',
              }[item.badge.variant] || 'bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)]';

              return (
                <Link
                  key={item.id}
                  to={`/course/${item.courseId}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={cn('px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap', courseColors.bg, courseColors.text)}>
                      {item.course?.code}
                    </span>
                    <span className="text-sm font-medium text-[var(--color-text-primary)] truncate">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-3 ml-3 shrink-0">
                    <span className="text-xs text-[var(--color-text-muted)]">{formatDate(item.dueDate)}</span>
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', badgeVariant)}>
                      {item.badge.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabs for Professor */}
      {isProfessor && (
        <div className="flex gap-1 mb-6 bg-[var(--color-bg-hover)] rounded-lg p-1 w-fit">
          {['overview', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize',
                activeTab === tab
                  ? 'bg-[var(--color-bg-card)] text-[var(--color-text-primary)] shadow-sm'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Analytics Tab */}
      {isProfessor && activeTab === 'analytics' && <AnalyticsPanel />}

      {/* Course Grid */}
      {(!isProfessor || activeTab === 'overview') && (
        <>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
            {isProfessor ? 'My Courses' : 'Enrolled Courses'}
          </h2>
          {courses.length === 0 ? (
            <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border-light)] p-12 text-center">
              <BookOpen size={40} className="mx-auto text-[var(--color-text-muted)] mb-3" />
              <p className="text-[var(--color-text-secondary)] font-medium">No courses found</p>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">Try switching to a different semester</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardPage;
