/**
 * helpers.js
 * 
 * Utility functions used across the application for formatting,
 * date handling, and general-purpose logic.
 */

/**
 * Formats an ISO date string into a human-readable format.
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted date string (e.g., "Apr 15, 2026")
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Formats a date string to include time.
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted date-time string
 */
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

/**
 * Calculates days remaining until a due date.
 * @param {string} dueDate - ISO date string for the due date
 * @returns {number} Number of days remaining (negative if overdue)
 */
export const getDaysRemaining = (dueDate) => {
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = due - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Returns a color class based on the days remaining.
 * @param {number} days - Days remaining
 * @returns {string} Tailwind color class
 */
export const getDueDateColor = (days) => {
  if (days < 0) return 'text-red-400';
  if (days <= 3) return 'text-amber-400';
  if (days <= 7) return 'text-yellow-300';
  return 'text-emerald-400';
};

/**
 * Returns a label for the due date status.
 * @param {number} days - Days remaining
 * @returns {string} Status label
 */
export const getDueDateLabel = (days) => {
  if (days < 0) return `${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} overdue`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  return `${days} days left`;
};

/**
 * Generates a unique ID string.
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} Unique ID
 */
export const generateId = (prefix = 'id') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Simulates an async API call with configurable delay.
 * @param {*} data - Data to resolve with
 * @param {number} delay - Delay in milliseconds (default: 400-800ms random)
 * @returns {Promise} Resolves with the provided data
 */
export const simulateApiCall = (data, delay = null) => {
  const actualDelay = delay || Math.floor(Math.random() * 400) + 400;
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), actualDelay);
  });
};

/**
 * Calculates submission progress for an assignment.
 * @param {string} assignmentId - The assignment ID
 * @param {Array} assignedStudentIds - Array of assigned student IDs
 * @param {Array} submissions - Array of all submissions
 * @returns {{ submitted: number, total: number, percentage: number }}
 */
export const calculateProgress = (assignmentId, assignedStudentIds, submissions) => {
  const total = assignedStudentIds.length;
  const submitted = submissions.filter(
    (s) => s.assignmentId === assignmentId && s.status === 'submitted'
  ).length;
  const percentage = total > 0 ? Math.round((submitted / total) * 100) : 0;
  return { submitted, total, percentage };
};

/**
 * Truncates text to a specified length with ellipsis.
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 120) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};
