import { useState, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import AssignmentCard from '../components/AssignmentCard';
import ProfessorCard from '../components/ProfessorCard';
import AssignmentForm from '../components/AssignmentForm';
import ConfirmDialog from '../components/ConfirmDialog';
import CircularProgress from '../components/ui/CircularProgress';
import { ChevronRight, Plus, Search, FileX, Users, Crown, AlertTriangle } from 'lucide-react';
import { getDaysRemaining, getCourseColor } from '../utils/helpers';
import { cn } from '../utils/cn';
import CoursePageSkeleton from '../components/ui/CoursePageSkeleton';

const CoursePage = () => {
  const { courseId } = useParams();
  const {
    currentUser, courses, users,
    getAssignmentsForCourse, acknowledgments,
    createAssignment, updateAssignment, deleteAssignment,
    getGroupForStudent,
    loading,
  } = useAppContext();

  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'all';
  const sort = searchParams.get('sort') || 'dueDate';
  const search = searchParams.get('q') || '';

  const setFilter = (val) => {
    const params = new URLSearchParams(searchParams);
    if (val === 'all') params.delete('filter'); else params.set('filter', val);
    setSearchParams(params, { replace: true });
  };
  const setSort = (val) => {
    const params = new URLSearchParams(searchParams);
    if (val === 'dueDate') params.delete('sort'); else params.set('sort', val);
    setSearchParams(params, { replace: true });
  };
  const setSearch = (val) => {
    const params = new URLSearchParams(searchParams);
    if (!val) params.delete('q'); else params.set('q', val);
    setSearchParams(params, { replace: true });
  };
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [deletingAssignment, setDeletingAssignment] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const course = courses.find((c) => c.id === courseId);
  const assignments = getAssignmentsForCourse(courseId);
  const isProfessor = currentUser?.role === 'professor';

  const filterCounts = useMemo(() => {
    if (!course) return { all: 0, pending: 0, completed: 0, overdue: 0, individual: 0, group: 0 };
    return {
      all: assignments.length,
      pending: assignments.filter((a) => {
        if (isProfessor) {
          const acked = course.studentIds.filter((sid) =>
            acknowledgments.find((ack) => ack.assignmentId === a.id && ack.studentId === sid)
          ).length;
          return acked < course.studentIds.length;
        }
        return !acknowledgments.find((ack) => ack.assignmentId === a.id && ack.studentId === currentUser.id);
      }).length,
      completed: assignments.filter((a) => {
        if (isProfessor) {
          const acked = course.studentIds.filter((sid) =>
            acknowledgments.find((ack) => ack.assignmentId === a.id && ack.studentId === sid)
          ).length;
          return acked === course.studentIds.length;
        }
        return !!acknowledgments.find((ack) => ack.assignmentId === a.id && ack.studentId === currentUser.id);
      }).length,
      overdue: assignments.filter((a) => getDaysRemaining(a.dueDate) < 0).length,
      individual: assignments.filter((a) => a.submissionType === 'individual').length,
      group: assignments.filter((a) => a.submissionType === 'group').length,
    };
  }, [assignments, acknowledgments, course, currentUser, isProfessor]);

  if (loading) return <CoursePageSkeleton />;

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <p className="text-[var(--color-text-muted)]">Course not found</p>
        <Link to="/" className="text-[var(--color-primary)] text-sm hover:underline mt-2 inline-block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const professor = users.find((u) => u.id === course.professorId);
  const colors = getCourseColor(course.color);

  const totalAcked = assignments.reduce((acc, a) => {
    return acc + course.studentIds.filter((sid) =>
      acknowledgments.find((ack) => ack.assignmentId === a.id && ack.studentId === sid)
    ).length;
  }, 0);
  const totalPossible = assignments.length * course.studentIds.length;

  const filteredAssignments = assignments
    .filter((a) => {
      if (search) {
        const q = search.toLowerCase();
        if (!a.title.toLowerCase().includes(q) && !a.description.toLowerCase().includes(q)) return false;
      }
      if (filter === 'pending') {
        if (isProfessor) {
          const acked = course.studentIds.filter((sid) =>
            acknowledgments.find((ack) => ack.assignmentId === a.id && ack.studentId === sid)
          ).length;
          return acked < course.studentIds.length;
        }
        return !acknowledgments.find((ack) => ack.assignmentId === a.id && ack.studentId === currentUser.id);
      }
      if (filter === 'completed') {
        if (isProfessor) {
          const acked = course.studentIds.filter((sid) =>
            acknowledgments.find((ack) => ack.assignmentId === a.id && ack.studentId === sid)
          ).length;
          return acked === course.studentIds.length;
        }
        return !!acknowledgments.find((ack) => ack.assignmentId === a.id && ack.studentId === currentUser.id);
      }
      if (filter === 'overdue') return getDaysRemaining(a.dueDate) < 0;
      if (filter === 'individual') return a.submissionType === 'individual';
      if (filter === 'group') return a.submissionType === 'group';
      return true;
    })
    .sort((a, b) => {
      if (sort === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
      if (sort === 'title') return a.title.localeCompare(b.title);
      if (sort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  const handleCreate = async (data) => {
    await createAssignment(data);
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setShowForm(true);
  };

  const handleUpdate = async (data) => {
    await updateAssignment(editingAssignment.id, data);
    setEditingAssignment(null);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    await deleteAssignment(deletingAssignment.id);
    setDeleteLoading(false);
    setDeletingAssignment(null);
  };

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'completed', label: 'Completed' },
    { key: 'overdue', label: 'Overdue' },
    { key: 'individual', label: 'Individual' },
    { key: 'group', label: 'Group' },
  ];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] mb-6">
        <Link to="/" className="hover:text-[var(--color-primary)] transition-colors">Dashboard</Link>
        <ChevronRight size={14} />
        <span className="text-[var(--color-text-primary)] font-medium">{course.code}</span>
      </div>

      {/* Course Header */}
      <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border-light)] shadow-[var(--shadow-sm)] p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${colors.bg} ${colors.text}`}>
                {course.code}
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">{course.semester}</span>
            </div>
            <h1 className="text-xl font-bold text-[var(--color-text-primary)] mb-1">{course.name}</h1>
            <p className="text-sm text-[var(--color-text-muted)]">{course.description}</p>
            {!isProfessor && professor && (
              <p className="text-sm text-[var(--color-text-secondary)] mt-2">Instructor: {professor.name}</p>
            )}
          </div>
          <CircularProgress value={totalAcked} max={totalPossible} size={72} />
        </div>

        {isProfessor && (
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-[var(--color-border-light)]">
            <div className="text-center">
              <p className="text-lg font-bold text-[var(--color-text-primary)]">{assignments.length}</p>
              <p className="text-[11px] text-[var(--color-text-muted)]">Assignments</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-[var(--color-text-primary)]">{course.studentIds.length}</p>
              <p className="text-[11px] text-[var(--color-text-muted)]">Students</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-[var(--color-text-primary)]">{totalPossible > 0 ? Math.round((totalAcked / totalPossible) * 100) : 0}%</p>
              <p className="text-[11px] text-[var(--color-text-muted)]">Completion</p>
            </div>
          </div>
        )}

        {isProfessor && (
          <button
            onClick={() => { setEditingAssignment(null); setShowForm(true); }}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            <Plus size={16} />
            New Assignment
          </button>
        )}
      </div>

      {/* My Group (students only) */}
      {!isProfessor && (() => {
        const myGroup = getGroupForStudent(courseId);
        if (myGroup) {
          const members = myGroup.memberIds
            .map((mid) => users.find((u) => u.id === mid))
            .filter(Boolean);
          const avatarColors = [
            'bg-purple-500', 'bg-blue-500', 'bg-emerald-500', 'bg-rose-500',
            'bg-amber-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-pink-500',
          ];
          return (
            <div className="max-w-md mb-6">
              <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border-light)] shadow-[var(--shadow-sm)] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users size={16} className="text-[var(--color-primary)]" />
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                    My Group: {myGroup.name}
                  </span>
                </div>
                <div className="space-y-2">
                  {members.map((member, idx) => {
                    const initials = member.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2);
                    const isLeader = member.id === myGroup.leaderId;
                    return (
                      <div key={member.id} className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            'w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0',
                            avatarColors[idx % avatarColors.length]
                          )}
                        >
                          {initials}
                        </div>
                        <span className="text-sm text-[var(--color-text-primary)]">{member.name}</span>
                        {isLeader && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600">
                            <Crown size={12} />
                            Leader
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        }
        return (
          <div className="max-w-md mb-6">
            <div className="bg-[var(--color-warning-light)] border border-[var(--color-warning)]/30 rounded-xl p-4 flex items-center gap-3">
              <AlertTriangle size={18} className="text-[var(--color-warning)] shrink-0" />
              <span className="text-sm text-[var(--color-warning)] font-medium">
                You're not in a group for this course
              </span>
            </div>
          </div>
        );
      })()}

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Filter pills */}
        <div className="relative flex-1">
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors',
                  filter === f.key
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border-light)]'
                )}
              >
                {f.label}
                <span className="ml-1 opacity-70">{filterCounts[f.key]}</span>
              </button>
            ))}
          </div>
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[var(--color-bg-app)] to-transparent sm:hidden" />
        </div>

        {/* Search + Sort */}
        <div className="flex gap-2 shrink-0">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-8 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] text-xs w-40 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-xs bg-[var(--color-bg-card)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          >
            <option value="dueDate">Due date</option>
            <option value="title">Title</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Assignment List */}
      {filteredAssignments.length === 0 ? (
        <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border-light)] p-12 text-center">
          <FileX size={40} className="mx-auto mb-3 text-[var(--color-text-muted)] opacity-50" />
          <p className="text-[var(--color-text-muted)] font-medium">No assignments found</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAssignments.map((assignment) =>
            isProfessor ? (
              <ProfessorCard
                key={assignment.id}
                assignment={assignment}
                course={course}
                onEdit={handleEdit}
                onDelete={setDeletingAssignment}
              />
            ) : (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                course={course}
              />
            )
          )}
        </div>
      )}

      {/* Assignment Form Modal */}
      <AssignmentForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingAssignment(null); }}
        onSubmit={editingAssignment ? handleUpdate : handleCreate}
        assignment={editingAssignment}
        courseId={courseId}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingAssignment}
        onClose={() => setDeletingAssignment(null)}
        onConfirm={handleDelete}
        title="Delete Assignment"
        message={`Are you sure you want to delete "${deletingAssignment?.title}"? This will also remove all acknowledgment records.`}
        confirmLabel="Delete"
        danger
        loading={deleteLoading}
      />
    </div>
  );
};

export default CoursePage;
