import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, ExternalLink, AlertCircle } from 'lucide-react';
import { formatDate, getDaysRemaining, getDueDateColor, getDueDateLabel } from '../../utils/helpers';
import { cn } from '../../utils/cn';

const StudentAssignmentCard = ({ assignment, submission, onSubmit }) => {
  const daysRemaining = getDaysRemaining(assignment.dueDate);
  const isSubmitted = submission?.status === 'submitted';
  const isOverdue = daysRemaining < 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="card card-interactive group"
    >
      <div className="p-6 flex flex-col h-full">
        {/* Status + Title */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <span className={cn(
              'badge text-[11px] mb-2',
              isSubmitted ? 'badge-success' : isOverdue ? 'badge-danger' : 'badge-neutral'
            )}>
              {isSubmitted ? 'Completed' : isOverdue ? 'Overdue' : 'In Progress'}
            </span>
            <h3 className="text-base font-semibold text-slate-900 leading-snug">
              {assignment.title}
            </h3>
          </div>
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
            isSubmitted ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-400'
          )}>
            {isSubmitted ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-1">
          {assignment.description}
        </p>

        {/* Meta Bar */}
        <div className="bg-slate-50 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={14} className={cn(isOverdue && !isSubmitted ? 'text-red-400' : 'text-slate-400')} />
            <span className="font-medium text-slate-700">{formatDate(assignment.dueDate)}</span>
            <span className={cn('text-xs font-medium', getDueDateColor(daysRemaining))}>
              {getDueDateLabel(daysRemaining)}
            </span>
          </div>
          <a
            href={assignment.driveLink || "https://drive.google.com/drive/u/0/my-drive"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-50 px-2.5 py-1.5 rounded-lg"
          >
            <ExternalLink size={12} /> Drive
          </a>
        </div>

        {/* Action */}
        {isSubmitted && submission?.submittedAt ? (
          <div className="flex items-center gap-2 justify-center w-full py-2.5 bg-emerald-50 rounded-xl text-emerald-600 text-sm font-medium">
            <CheckCircle2 size={16} /> Submitted {formatDate(submission.submittedAt)}
          </div>
        ) : (
          <button onClick={() => onSubmit(assignment)} className="btn-primary w-full">
            <CheckCircle2 size={16} /> Mark as Complete
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default StudentAssignmentCard;
