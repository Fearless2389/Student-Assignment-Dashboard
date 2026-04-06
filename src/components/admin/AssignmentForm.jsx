import { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

const AssignmentForm = ({ assignment, onSubmit, onCancel }) => {
  const { users } = useAppContext();
  const students = useMemo(() => users.filter(u => u.role === 'student'), [users]);

  const [formData, setFormData] = useState({ title: '', description: '', dueDate: '', driveLink: '', assignedTo: [] });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (assignment) setFormData(assignment);
  }, [assignment]);

  const toggleStudent = (id) => {
    setFormData(prev => ({ ...prev, assignedTo: prev.assignedTo.includes(id) ? prev.assignedTo.filter(s => s !== id) : [...prev.assignedTo, id] }));
    if(errors.assignedTo) setErrors(e => ({...e, assignedTo: ''}));
  };

  const validate = () => {
    const err = {};
    if (!formData.title.trim()) err.title = 'Required';
    if (!formData.description.trim()) err.description = 'Required';
    if (!formData.dueDate) err.dueDate = 'Required';
    if (!formData.driveLink.trim()) err.driveLink = 'Required';
    if (formData.assignedTo.length === 0) err.assignedTo = 'Select at least one student';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  return (
    <form onSubmit={e => { e.preventDefault(); if (validate()) onSubmit(formData); }} className="space-y-6">
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Assignment Title</label>
        <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={cn('input', errors.title && 'border-red-300 focus:border-red-400')} placeholder="e.g. React Component Architecture" />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</label>
        <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className={cn('input resize-none', errors.description && 'border-red-300')} placeholder="Describe requirements..." />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Due Date</label>
          <input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className={cn('input', errors.dueDate && 'border-red-300')} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Drive Folder Link</label>
          <input type="url" value={formData.driveLink} onChange={e => setFormData({...formData, driveLink: e.target.value})} className={cn('input', errors.driveLink && 'border-red-300')} placeholder="https://drive.google.com/..." />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
           <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Assignees</label>
           <button type="button" onClick={() => setFormData(p => ({...p, assignedTo: p.assignedTo.length === students.length ? [] : students.map(s => s.id)}))} className="text-xs font-medium text-indigo-600 hover:text-indigo-700">Toggle All</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {students.map(s => (
            <div key={s.id} onClick={() => toggleStudent(s.id)} className={cn("p-3.5 rounded-xl border transition-colors cursor-pointer flex items-center justify-between group", formData.assignedTo.includes(s.id) ? "bg-indigo-50 border-indigo-200 text-indigo-900" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100")}>
              <div className="flex items-center gap-3">
                 <span className="text-lg">{s.avatar}</span>
                 <span className="text-sm font-semibold">{s.name}</span>
              </div>
              {formData.assignedTo.includes(s.id) && <Check size={16} className="text-indigo-600" />}
            </div>
          ))}
        </div>
        {errors.assignedTo && <p className="text-red-500 text-xs mt-2 font-medium">{errors.assignedTo}</p>}
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
        <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>
        <button type="submit" className="btn-primary">Save Assignment</button>
      </div>
    </form>
  );
};
export default AssignmentForm;
