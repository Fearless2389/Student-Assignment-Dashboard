export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDeadline = (dateStr) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getDaysRemaining = (dueDate) => {
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = due - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getDueDateColor = (days) => {
  if (days < 0) return 'text-red-500';
  if (days <= 2) return 'text-red-500';
  if (days <= 5) return 'text-amber-500';
  return 'text-emerald-500';
};

export const getDueDateBadge = (days) => {
  if (days < 0) return { label: `${Math.abs(days)}d overdue`, variant: 'danger' };
  if (days === 0) return { label: 'Due today', variant: 'danger' };
  if (days === 1) return { label: 'Due tomorrow', variant: 'warning' };
  if (days <= 5) return { label: `${days} days left`, variant: 'warning' };
  return { label: `${days} days left`, variant: 'success' };
};

export const getDueDateLabel = (days) => {
  if (days < 0) return `${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} overdue`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  return `${days} days left`;
};

export const generateId = (prefix = 'id') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const simulateApiCall = (data, delay = null) => {
  const actualDelay = delay || Math.floor(Math.random() * 300) + 200;
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), actualDelay);
  });
};

export const calculateProgress = (assignmentId, studentIds, acknowledgments) => {
  const total = studentIds.length;
  const acknowledged = acknowledgments.filter(
    (a) => a.assignmentId === assignmentId && studentIds.includes(a.studentId)
  ).length;
  const percentage = total > 0 ? Math.round((acknowledged / total) * 100) : 0;
  return { acknowledged, total, percentage };
};

export const truncateText = (text, maxLength = 120) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const generateMockJWT = (userId) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: userId, iat: Date.now(), exp: Date.now() + 86400000 }));
  const signature = btoa(userId + '-signature');
  return `${header}.${payload}.${signature}`;
};

export const getCourseColor = (color) => {
  const colors = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200', dot: 'bg-indigo-500', gradient: 'from-indigo-500 to-indigo-600' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', dot: 'bg-emerald-500', gradient: 'from-emerald-500 to-emerald-600' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200', dot: 'bg-violet-500', gradient: 'from-violet-500 to-violet-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', dot: 'bg-amber-500', gradient: 'from-amber-500 to-amber-600' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', dot: 'bg-rose-500', gradient: 'from-rose-500 to-rose-600' },
    sky: { bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200', dot: 'bg-sky-500', gradient: 'from-sky-500 to-sky-600' },
  };
  return colors[color] || colors.indigo;
};
