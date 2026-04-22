import { useAppContext } from '../context/AppContext';
import ProgressBar from './ui/ProgressBar';
import { Users, BookOpen, TrendingUp, ClipboardCopy } from 'lucide-react';

const AnalyticsPanel = () => {
  const { getAnalyticsForProfessor, addToast } = useAppContext();
  const analytics = getAnalyticsForProfessor();

  const handleQuickExport = () => {
    if (!analytics) return;
    const lines = ['JOineazy Analytics Summary', '==========================', 'Student Progress:'];
    const sorted = [...analytics.studentProgress].sort((a, b) => b.percentage - a.percentage);
    sorted.forEach(({ student, acked, total, percentage }) => {
      lines.push(`- ${student?.name}: ${acked}/${total} (${percentage}%)`);
    });
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      addToast('Analytics summary copied to clipboard', 'success');
    }).catch(() => {
      addToast('Failed to copy to clipboard', 'error');
    });
  };

  if (!analytics) return null;

  const { studentProgress, assignmentCompletion, groupStatus } = analytics;
  const sortedStudents = [...studentProgress].sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Quick Stats */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Quick Stats</h3>
        <button
          onClick={handleQuickExport}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[var(--color-border-light)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-app)] transition-colors"
        >
          <ClipboardCopy size={13} />
          Quick Export
        </button>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border-light)] p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-light)] flex items-center justify-center">
              <Users size={16} className="text-[var(--color-primary)]" />
            </div>
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">Total Students</span>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">{studentProgress.length}</p>
        </div>
        <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border-light)] p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-success-light)] flex items-center justify-center">
              <BookOpen size={16} className="text-[var(--color-success)]" />
            </div>
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">Total Assignments</span>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">{assignmentCompletion.length}</p>
        </div>
        <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border-light)] p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-warning-light)] flex items-center justify-center">
              <TrendingUp size={16} className="text-[var(--color-warning)]" />
            </div>
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">Avg Completion</span>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">
            {assignmentCompletion.length > 0
              ? Math.round(assignmentCompletion.reduce((s, a) => s + a.percentage, 0) / assignmentCompletion.length)
              : 0}%
          </p>
        </div>
      </div>

      {/* Student Progress */}
      <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border-light)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border-light)]">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Student Progress</h3>
        </div>
        <div className="divide-y divide-[var(--color-border-light)]">
          {sortedStudents.map(({ student, total, acked, percentage }, index) => (
            <div key={student?.id} className="flex items-center gap-4 px-5 py-3">
              <span className="text-[11px] font-bold text-[var(--color-text-muted)] w-5 text-right shrink-0">
                #{index + 1}
              </span>
              <div className="w-8 h-8 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center text-[11px] font-bold text-[var(--color-primary)] shrink-0">
                {student?.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{student?.name}</p>
                <div className="mt-1.5">
                  <ProgressBar value={acked} max={total} color="auto" size="sm" />
                </div>
              </div>
              <span className="text-xs font-semibold text-[var(--color-text-secondary)] tabular-nums shrink-0">
                {acked}/{total}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Assignment Completion */}
      <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border-light)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border-light)]">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Assignment Completion</h3>
        </div>
        <div className="p-5 space-y-4">
          {assignmentCompletion.map(({ assignment, total, acked, percentage }) => (
            <div key={assignment.id}>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-sm font-medium text-[var(--color-text-primary)] truncate pr-4">{assignment.title}</p>
                <span className="text-xs font-semibold text-[var(--color-text-muted)] tabular-nums shrink-0">{percentage}%</span>
              </div>
              <ProgressBar value={acked} max={total} color="auto" size="sm" />
            </div>
          ))}
        </div>
      </div>

      {/* Group Status */}
      {groupStatus.length > 0 && (
        <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border-light)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border-light)]">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Group Submission Status</h3>
          </div>
          <div className="p-5 space-y-4">
            {groupStatus.map(({ assignment, groups }) => (
              <div key={assignment.id}>
                <p className="text-sm font-medium text-[var(--color-text-primary)] mb-2">{assignment.title}</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {groups.map(({ group, status }) => (
                    <div key={group.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-bg-app)]">
                      <div className={`w-2 h-2 rounded-full ${
                        status === 'complete' ? 'bg-[var(--color-success)]' : status === 'partial' ? 'bg-[var(--color-warning)]' : 'bg-[var(--color-text-muted)]'
                      }`} />
                      <span className="text-sm text-[var(--color-text-secondary)]">{group.name}</span>
                      <span className={`ml-auto text-[11px] font-medium ${
                        status === 'complete' ? 'text-[var(--color-success)]' : status === 'partial' ? 'text-[var(--color-warning)]' : 'text-[var(--color-text-muted)]'
                      }`}>
                        {status === 'complete' ? 'Submitted' : status === 'partial' ? 'Partial' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPanel;
