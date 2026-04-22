import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Calendar, ExternalLink, Users, User, CheckCircle, AlertTriangle, Crown, Copy } from 'lucide-react';
import { formatDeadline, getDaysRemaining, getDueDateBadge, formatDateTime } from '../utils/helpers';
import { cn } from '../utils/cn';
import ConfirmDialog from './ConfirmDialog';

const AssignmentCard = ({ assignment, course }) => {
  const { currentUser, getAcknowledgment, acknowledgeAssignment, getGroupForStudent, users, addToast } = useAppContext();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const ack = getAcknowledgment(assignment.id);
  const isAcked = !!ack;
  const daysLeft = getDaysRemaining(assignment.dueDate);
  const dueBadge = getDueDateBadge(daysLeft);
  const isGroup = assignment.submissionType === 'group';
  const group = isGroup ? getGroupForStudent(assignment.courseId) : null;
  const isLeader = group?.leaderId === currentUser?.id;

  const acknowledgedByUser = ack ? users.find((u) => u.id === ack.acknowledgedBy) : null;
  const wasAckedByLeader = ack && ack.acknowledgedBy !== currentUser?.id;

  const handleAcknowledge = async () => {
    setLoading(true);
    try {
      await acknowledgeAssignment(assignment.id, assignment);
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  const badgeColors = {
    success: 'bg-[var(--color-success-light)] text-[var(--color-success)]',
    warning: 'bg-[var(--color-warning-light)] text-[var(--color-warning)]',
    danger: 'bg-[var(--color-danger-light)] text-[var(--color-danger)]',
  };

  return (
    <>
      <div className={cn(
        'bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border-light)] shadow-[var(--shadow-sm)] overflow-hidden transition-all hover:shadow-[var(--shadow-md)]',
        isAcked && 'border-[var(--color-success)]/30 border-l-4 border-l-[var(--color-success)]'
      )}>
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="text-base font-semibold text-[var(--color-text-primary)] leading-snug">
              {assignment.title}
            </h3>
            <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0', badgeColors[dueBadge.variant])}>
              {dueBadge.label}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 mb-4">
            {assignment.description}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-muted)] mb-4">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} />
              {formatDeadline(assignment.dueDate)}
            </span>
            <span className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium',
              isGroup ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]' : 'bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)]'
            )}>
              {isGroup ? <Users size={11} /> : <User size={11} />}
              {isGroup ? 'Group' : 'Individual'}
            </span>
          </div>

          {/* Group Info */}
          {isGroup && (
            <div className={cn(
              'rounded-lg p-3 mb-4 text-sm',
              group
                ? 'bg-[var(--color-primary-subtle)] text-[var(--color-text-secondary)]'
                : 'bg-[var(--color-warning-light)] text-[var(--color-warning)]'
            )}>
              {group ? (
                <div className="flex items-center gap-2">
                  <Users size={14} />
                  <span className="font-medium">{group.name}</span>
                  {isLeader && (
                    <span className="flex items-center gap-1 ml-auto text-[11px] font-semibold text-[var(--color-primary)]">
                      <Crown size={12} /> Leader
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} />
                  <span className="font-medium">You're not in a group for this course</span>
                </div>
              )}
            </div>
          )}

          {/* Drive Link */}
          {assignment.driveLink && (
            <div className="flex items-center gap-2 mb-4">
              <a
                href={assignment.driveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-[var(--color-primary)] hover:underline"
              >
                <ExternalLink size={14} />
                Open in OneDrive
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

          {/* Acknowledged state or Action */}
          {isAcked ? (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[var(--color-success-light)]">
              <CheckCircle size={16} className="text-[var(--color-success)]" />
              <div>
                <span className="text-sm font-medium text-[var(--color-success)]">
                  {wasAckedByLeader
                    ? `Acknowledged by ${acknowledgedByUser?.name || 'Group Leader'}`
                    : 'Acknowledged'}
                </span>
                <p className="text-[11px] text-[var(--color-success)] opacity-70 mt-0.5">
                  {formatDateTime(ack.acknowledgedAt)}
                </p>
              </div>
            </div>
          ) : (
            <div>
              {isGroup && !isLeader && group ? (
                <p className="text-xs text-[var(--color-text-muted)] italic">
                  Only the group leader can acknowledge this assignment
                </p>
              ) : isGroup && !group ? null : (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="w-full py-2.5 rounded-lg text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-colors"
                >
                  {isGroup ? 'Acknowledge for Group' : 'I have submitted'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Double-confirmation dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleAcknowledge}
        title="Confirm Submission"
        message={
          isGroup
            ? 'Are you sure you want to acknowledge this assignment for your entire group? This action cannot be undone.'
            : 'Are you sure you have submitted this assignment? This action cannot be undone.'
        }
        confirmLabel="Yes, I have submitted"
        loading={loading}
      />
    </>
  );
};

export default AssignmentCard;
