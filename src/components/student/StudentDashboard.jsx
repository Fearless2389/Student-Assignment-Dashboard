import { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import StudentAssignmentCard from './StudentAssignmentCard';
import { BookOpen, CheckCircle2, Clock, TrendingUp, Link as LinkIcon } from 'lucide-react';
import Modal from '../Modal';
import { cn } from '../../utils/cn';
import { formatDate } from '../../utils/helpers';

const StudentDashboard = () => {
  const { currentUser, assignments, submitAssignment, getSubmissionStatus } = useAppContext();
  const [filter, setFilter] = useState('all');
  const [submissionModal, setSubmissionModal] = useState({ open: false, assignment: null, link: '' });

  const myAssignments = useMemo(
    () => assignments.filter(a => a.assignedTo.includes(currentUser.id)),
    [assignments, currentUser.id]
  );

  const stats = useMemo(() => {
    const total = myAssignments.length;
    const submitted = myAssignments.filter(a => getSubmissionStatus(a.id, currentUser.id)?.status === 'submitted').length;
    return { total, submitted, pending: total - submitted, percentage: total ? Math.round((submitted / total) * 100) : 0 };
  }, [myAssignments, currentUser.id, getSubmissionStatus]);

  const filteredAssignments = useMemo(() => {
    return myAssignments.filter(a => {
      const sub = getSubmissionStatus(a.id, currentUser.id);
      if (filter === 'pending') return !sub || sub.status !== 'submitted';
      if (filter === 'submitted') return sub?.status === 'submitted';
      return true;
    });
  }, [myAssignments, filter, currentUser.id, getSubmissionStatus]);

  const statCards = [
    { label: 'Total Assigned', value: stats.total, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Submitted', value: stats.submitted, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Completion', value: `${stats.percentage}%`, icon: TrendingUp, color: 'text-violet-600', bg: 'bg-violet-50', showProgress: true },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">

      {/* ── Page Header ── */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Welcome back, {currentUser.name}</h1>
        <p className="text-slate-500 text-sm mt-1">Here's an overview of your assignments.</p>
      </motion.div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 lg:mb-16">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-500">{stat.label}</span>
              <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', stat.bg, stat.color)}>
                <stat.icon size={18} />
              </div>
            </div>
            <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
            {stat.showProgress && (
              <div className="progress-track mt-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.percentage}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="progress-fill bg-gradient-to-r from-indigo-500 to-violet-500"
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex items-center gap-2 mt-12 mb-10 bg-slate-100 border border-slate-200 rounded-xl p-1.5 w-fit">
        {['all', 'pending', 'submitted'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg transition-all',
              filter === f
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Assignment Cards Grid ── */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredAssignments.length > 0 ? (
            filteredAssignments.map((assignment) => (
              <StudentAssignmentCard
                key={assignment.id}
                assignment={assignment}
                submission={getSubmissionStatus(assignment.id, currentUser.id)}
                onSubmit={(a) => setSubmissionModal({ open: true, assignment: a, link: '' })}
              />
            ))
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={28} className="text-slate-300" />
              </div>
              <p className="text-slate-700 font-medium">All caught up!</p>
              <p className="text-sm text-slate-400 mt-1">No assignments match this filter.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Submission Modal ── */}
      <Modal isOpen={submissionModal.open} onClose={() => setSubmissionModal({ open: false, assignment: null, link: '' })} title="Submit Assignment">
        <div className="space-y-5">
          {submissionModal.assignment && (
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm font-medium text-slate-800">{submissionModal.assignment.title}</p>
              <p className="text-xs text-slate-400 mt-1">Due: {formatDate(submissionModal.assignment.dueDate)}</p>
            </div>
          )}
          <p className="text-sm text-slate-500">
            Paste a link to your work — Google Drive, GitHub, or any hosted URL.
          </p>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Submission Link</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <LinkIcon size={16} className="text-slate-300" />
              </div>
              <input
                type="url"
                value={submissionModal.link}
                onChange={(e) => setSubmissionModal(prev => ({ ...prev, link: e.target.value }))}
                placeholder="https://drive.google.com/..."
                className="input pl-10"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button onClick={() => setSubmissionModal({ open: false, assignment: null, link: '' })} className="btn-ghost">Cancel</button>
            <button
              onClick={handleSubmit}
              disabled={!submissionModal.link.trim()}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Submit Work
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );

  function handleSubmit() {
    if (submissionModal.assignment && submissionModal.link.trim()) {
      submitAssignment(submissionModal.assignment.id);
      setSubmissionModal({ open: false, assignment: null, link: '' });
    }
  }
};

export default StudentDashboard;
