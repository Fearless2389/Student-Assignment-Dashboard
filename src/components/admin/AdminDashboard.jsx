import { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import AdminAssignmentCard from './AdminAssignmentCard';
import AssignmentForm from './AssignmentForm';
import Modal from '../Modal';
import ConfirmDialog from '../ConfirmDialog';
import { Plus, BookOpen, Users, CheckCircle2, TrendingUp, Search } from 'lucide-react';
import { calculateProgress } from '../../utils/helpers';
import { cn } from '../../utils/cn';

const AdminDashboard = () => {
  const { currentUser, assignments, submissions, users, createAssignment, updateAssignment, deleteAssignment } = useAppContext();
  const [filter, setFilter] = useState('all');
  const [formModal, setFormModal] = useState({ open: false, assignment: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, assignment: null });

  const myAssignments = useMemo(() => assignments.filter(a => a.createdBy === currentUser.id), [assignments, currentUser.id]);
  const students = useMemo(() => users.filter(u => u.role === 'student'), [users]);

  const stats = useMemo(() => {
    const totalAssignments = myAssignments.length;
    const totalStudentsAssigned = new Set(myAssignments.flatMap(a => a.assignedTo)).size;
    const totalSubmissions = myAssignments.reduce((sum, a) => sum + calculateProgress(a.id, a.assignedTo, submissions).submitted, 0);
    const totalExpected = myAssignments.reduce((sum, a) => sum + a.assignedTo.length, 0);
    const overallRate = totalExpected > 0 ? Math.round((totalSubmissions / totalExpected) * 100) : 0;
    return { totalAssignments, totalStudentsAssigned, totalSubmissions, totalExpected, overallRate };
  }, [myAssignments, submissions]);

  const filteredAssignments = useMemo(() => {
    if (filter === 'all') return myAssignments;
    return myAssignments.filter(a => {
      const p = calculateProgress(a.id, a.assignedTo, submissions).percentage;
      if (filter === 'inprogress') return p > 0 && p < 100;
      if (filter === 'complete') return p === 100;
      return p === 0;
    });
  }, [myAssignments, filter, submissions]);

  const statCards = [
    { label: 'Active Assignments', value: stats.totalAssignments, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Total Students', value: stats.totalStudentsAssigned, icon: Users, color: 'text-sky-600', bg: 'bg-sky-50' },
    { label: 'Submissions', value: `${stats.totalSubmissions}/${stats.totalExpected}`, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Completion Rate', value: `${stats.overallRate}%`, icon: TrendingUp, color: 'text-violet-600', bg: 'bg-violet-50', showProgress: true },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
      
      {/* ── Page Header ── */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Professor Console</h1>
          <p className="text-slate-500 text-sm mt-1">Manage assignments and track student progress.</p>
        </div>
        <button onClick={() => setFormModal({ open: true, assignment: null })} className="btn-primary">
          <Plus size={16} /> New Assignment
        </button>
      </motion.div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 lg:mb-16">
        {statCards.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 12 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.06 }}
            className="card p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                 <span className="text-sm font-medium text-slate-500">{stat.label}</span>
                 <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', stat.bg, stat.color)}>
                   <stat.icon size={18} />
                 </div>
              </div>
              <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
            </div>
            {stat.showProgress && (
              <div className="progress-track mt-4">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${stats.overallRate}%` }} 
                  transition={{ duration: 0.8, ease: "easeOut" }} 
                  className="progress-fill bg-gradient-to-r from-indigo-500 to-violet-500" 
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="flex items-center gap-2 mt-12 mb-10 bg-slate-100 border border-slate-200 rounded-xl p-1.5 w-fit">
        {['all', 'inprogress', 'complete', 'nosubmissions'].map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f)} 
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg transition-all', 
              filter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            )}
          >
            {f === 'inprogress' ? 'Active' : f === 'nosubmissions' ? 'Empty' : f === 'complete' ? 'Done' : 'All'}
          </button>
        ))}
      </div>

      {/* ── Assignment Cards Grid ── */}
       <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {filteredAssignments.map(a => (
            <AdminAssignmentCard 
              key={a.id} 
              assignment={a} 
              onEdit={(a) => setFormModal({ open: true, assignment: a })} 
              onDelete={(a) => setDeleteConfirm({ open: true, assignment: a })} 
            />
          ))}
          {filteredAssignments.length === 0 && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Search size={28} className="text-slate-300" />
                </div>
                <p className="text-slate-700 font-medium">No assignments found</p>
                <p className="text-sm text-slate-400 mt-1">Try adjusting your filters or create a new one.</p>
             </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Modals ── */}
      <Modal isOpen={formModal.open} onClose={() => setFormModal({ open: false, assignment: null })} title={formModal.assignment ? 'Edit Assignment' : 'Create Assignment'} size="lg">
        <AssignmentForm
           assignment={formModal.assignment}
           onSubmit={async (data) => {
             formModal.assignment ? await updateAssignment(formModal.assignment.id, data) : await createAssignment(data);
             setFormModal({ open: false, assignment: null });
           }}
           onCancel={() => setFormModal({ open: false, assignment: null })}
        />
      </Modal>

      <ConfirmDialog
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, assignment: null })}
        onConfirm={() => { if(deleteConfirm.assignment) deleteAssignment(deleteConfirm.assignment.id); }}
        title="Delete Assignment"
        message="This will permanently delete the assignment and all associated student submission records. This action is irreversible."
        confirmText="Confirm Deletion"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default AdminDashboard;
