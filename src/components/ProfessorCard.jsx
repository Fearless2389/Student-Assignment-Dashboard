import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Calendar, Clock, ExternalLink, Users, User, Edit3, Trash2, ChevronDown, CheckCircle, Copy } from 'lucide-react';
import { formatDate, formatDeadline, getDaysRemaining, getDueDateBadge, calculateProgress } from '../utils/helpers';
import { cn } from '../utils/cn';
import ProgressBar from './ui/ProgressBar';

const ProfessorCard = ({ assignment, course, onEdit, onDelete }) => {
  const { acknowledgments, users, addToast } = useAppContext();
  const [expanded, setExpanded] = useState(false);

  const daysLeft = getDaysRemaining(assignment.dueDate);
  const dueBadge = getDueDateBadge(daysLeft);
  const isGroup = assignment.submissionType === 'group';
  const progress = calculateProgress(assignment.id, course.studentIds, acknowledgments);

  const badgeColors = {
    success: 'bg-[var(--color-success-light)] text-[var(--color-success)]',
    warning: 'bg-[var(--color-warning-light)] text-[var(--color-warning)]',
    danger: 'bg-[var(--color-danger-light)] text-[var(--color-danger)]',
  };

  return (
    <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border-light)] shadow-[var(--shadow-sm)] overflow-hidden hover:shadow-[var(--shadow-md)] transition-all">
      {/* Progress bar at top */}
      <div className="h-1 bg-[var(--color-border-light)]">
        <div
          className={cn(
            'h-full transition-all duration-500',
            progress.percentage >= 75 ? 'bg-[var(--color-success)]' : progress.percentage >= 40 ? 'bg-[var(--color-warning)]' : 'bg-[var(--color-danger)]'
          )}
          style={{ width: `${progress.percentage}%` }}
        />
      </div>

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-[var(--color-text-primary)] leading-snug">
              {assignment.title}
            </h3>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(assignment)}
              className="p-2.5 rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors"
              title="Edit"
            >
              <Edit3 size={15} className="text-[var(--color-text-muted)]" />
            </button>
            <button
              onClick={() => onDelete(assignment)}
              className="p-2.5 rounded-lg hover:bg-[var(--color-danger-light)] transition-colors"
              title="Delete"
            >
              <Trash2 size={15} className="text-[var(--color-text-muted)] hover:text-[var(--color-danger)]" />
            </button>
          </div>
        </div>

        <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 mb-3">
          {assignment.description}
        </p>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-muted)] mb-3">
          <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full font-semibold', badgeColors[dueBadge.variant])}>
            {dueBadge.label}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {formatDeadline(assignment.dueDate)}
          </span>
          <span className={cn(
            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium',
            isGroup ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]' : 'bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)]'
          )}>
            {isGroup ? <Users size={11} /> : <User size={11} />}
            {isGroup ? 'Group' : 'Individual'}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            Created {formatDate(assignment.createdAt)}
          </span>
        </div>

        {/* Drive Link */}
        {assignment.driveLink && (
          <div className="flex items-center gap-2 mb-3">
            <a
              href={assignment.driveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[var(--color-primary)] hover:underline"
            >
              <ExternalLink size={12} />
              OneDrive
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(assignment.driveLink);
                addToast('Link copied to clipboard!', 'success');
              }}
              className="p-1.5 rounded-md hover:bg-[var(--color-bg-hover)] transition-colors"
              title="Copy link"
            >
              <Copy size={14} className="text-[var(--color-text-muted)]" />
            </button>
          </div>
        )}

        {/* Progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-[var(--color-text-secondary)]">Completion</span>
            <span className="text-xs font-semibold text-[var(--color-text-primary)] tabular-nums">
              {progress.acknowledged}/{progress.total} ({progress.percentage}%)
            </span>
          </div>
          <ProgressBar value={progress.acknowledged} max={progress.total} color="auto" size="sm" />
        </div>

        {/* Student list toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-primary)] hover:underline"
        >
          <ChevronDown size={14} className={cn('transition-transform', expanded && 'rotate-180')} />
          {expanded ? 'Hide' : 'Show'} students
        </button>

        {/* Expanded student list */}
        {expanded && (
          <div className="mt-3 space-y-1.5 animate-fade-in">
            {course.studentIds.map((sid) => {
              const student = users.find((u) => u.id === sid);
              const studentAck = acknowledgments.find((a) => a.assignmentId === assignment.id && a.studentId === sid);
              return (
                <div key={sid} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[var(--color-bg-app)]">
                  <div className="w-6 h-6 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center text-[9px] font-bold text-[var(--color-primary)] shrink-0">
                    {student?.avatar}
                  </div>
                  <span className="text-sm text-[var(--color-text-secondary)] flex-1 truncate">{student?.name}</span>
                  {studentAck ? (
                    <CheckCircle size={14} className="text-[var(--color-success)] shrink-0" />
                  ) : (
                    <span className="text-[11px] text-[var(--color-text-muted)]">Pending</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessorCard;
