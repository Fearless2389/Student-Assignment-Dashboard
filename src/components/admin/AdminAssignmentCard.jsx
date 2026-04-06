import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, ExternalLink, Pencil, Trash2, ChevronDown, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { formatDate, formatDateTime, getDaysRemaining, calculateProgress } from '../../utils/helpers';
import { useAppContext } from '../../context/AppContext';
import { useState, useMemo } from 'react';
import { cn } from '../../utils/cn';

const AdminAssignmentCard = ({ assignment, onEdit, onDelete }) => {
  const { users, submissions } = useAppContext();
  const [showStudents, setShowStudents] = useState(false);

  const assignedStudents = useMemo(() => {
    return assignment.assignedTo.map(id => ({
      ...users.find(u => u.id === id),
      submission: submissions.find(s => s.assignmentId === assignment.id && s.studentId === id)
    })).filter(s => s.name);
  }, [assignment, users, submissions]);

  const progress = calculateProgress(assignment.id, assignment.assignedTo, submissions);

  return (
    <motion.div layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card group">
      {/* Top Progress Line */}
      <div className="h-1.5 bg-slate-100">
        <motion.div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400" initial={{ width: 0 }} animate={{ width: `${progress.percentage}%` }} transition={{ duration: 1 }} />
      </div>

      <div className="p-6">
        {/* Header Actions */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-lg font-semibold text-slate-900 flex-1 leading-tight">{assignment.title}</h3>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(assignment)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Pencil size={16} /></button>
            <button onClick={() => onDelete(assignment)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Calendar size={16} className="text-slate-400" /> <span>{formatDate(assignment.dueDate)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Users size={16} className="text-slate-400" /> <span>{assignment.assignedTo.length} assignees</span>
          </div>
          <a href={assignment.driveLink || "https://drive.google.com/drive/u/0/my-drive"} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1.5 rounded-lg ml-auto text-xs font-semibold transition-colors">
            <ExternalLink size={14} /> Drive
          </a>
        </div>

        {/* Expand Students Button */}
         <button
          onClick={() => setShowStudents(!showStudents)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-sm text-slate-500 transition-colors"
        >
          <span className="font-semibold text-slate-700">{progress.submitted} / {progress.total} Submitted</span>
          <ChevronDown size={18} className={cn("transition-transform text-slate-400", showStudents && "rotate-180")} />
        </button>

        {/* AI Insight Mock */}
        {progress.percentage < 50 && getDaysRemaining(assignment.dueDate) <= 2 && (
           <div className="mt-4 flex items-start gap-3 bg-amber-50 border border-amber-100 p-3.5 rounded-xl">
             <Sparkles size={16} className="text-amber-500 shrink-0 mt-0.5" />
             <p className="text-xs text-amber-700 leading-relaxed font-medium"><strong>Insight:</strong> 50% of students are at risk of missing this deadline based on historical submission patterns.</p>
           </div>
        )}

        <AnimatePresence>
          {showStudents && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="mt-4 space-y-2">
                {assignedStudents.map(student => {
                  const isSubmitted = student.submission?.status === 'submitted';
                  return (
                    <div key={student.id} className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border', isSubmitted ? 'bg-emerald-50/30 border-emerald-100' : 'bg-white border-slate-100')}>
                       <div className="flex items-center gap-3 w-full sm:w-1/3">
                         <span className="bg-slate-50 border border-slate-100 w-9 h-9 rounded-lg shrink-0 flex items-center justify-center text-sm">{student.avatar}</span>
                         <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate mb-0.5">{student.name}</p>
                            <p className="text-xs text-slate-500 truncate">{student.email}</p>
                         </div>
                       </div>
                       
                       {/* Individual Progress Bar */}
                       <div className="flex-1 w-full sm:px-4">
                          <div className="flex justify-between items-center mb-1.5">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Progress</span>
                              <span className={cn("text-[10px] font-bold uppercase tracking-wider", isSubmitted ? "text-emerald-600" : "text-amber-500")}>
                                  {isSubmitted ? '100% - Done' : '0% - Pending'}
                              </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className={cn("h-full rounded-full transition-all", isSubmitted ? "bg-emerald-500 w-full" : "bg-amber-400 w-0")} />
                          </div>
                       </div>

                       <div className="w-full sm:w-1/4 sm:text-right flex items-center sm:items-end justify-between sm:justify-end flex-row sm:flex-col gap-1 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t border-slate-100 sm:border-0">
                         {isSubmitted ? (
                           <>
                             <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-600 tracking-wider"><CheckCircle2 size={12}/> Submitted</span>
                             <span className="text-[10px] text-slate-400 font-medium truncate">{formatDateTime(student.submission.submittedAt)}</span>
                           </>
                         ) : (
                           <>
                             <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-amber-600 tracking-wider"><Clock size={12}/> Pending</span>
                             <span className="text-[10px] text-slate-400 font-medium">Awaiting upload</span>
                           </>
                         )}
                       </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
export default AdminAssignmentCard;
