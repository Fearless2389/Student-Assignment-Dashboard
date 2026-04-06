/**
 * AppContext.jsx
 * 
 * Global application context providing:
 * - Current user state and role switching
 * - Assignments CRUD operations
 * - Submissions management
 * - Toast notification system
 * 
 * All data is persisted to localStorage and loaded on mount.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  STORAGE_KEYS,
  initialUsers,
  initialAssignments,
  initialSubmissions,
} from '../data/mockData';
import { generateId, simulateApiCall } from '../utils/helpers';

const AppContext = createContext(null);

/**
 * Custom hook to access the AppContext.
 * Throws if used outside of AppProvider.
 */
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

/**
 * AppProvider component wraps the app and provides global state.
 */
export const AppProvider = ({ children }) => {
  // ===== State =====
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  // ===== Initialize data from localStorage or seed data =====
  useEffect(() => {
    const initData = async () => {
      setLoading(true);

      // Load or seed users
      const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      const loadedUsers = storedUsers ? JSON.parse(storedUsers) : initialUsers;
      if (!storedUsers) localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));

      // Load or seed assignments
      const storedAssignments = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
      const loadedAssignments = storedAssignments
        ? JSON.parse(storedAssignments)
        : initialAssignments;
      if (!storedAssignments)
        localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(initialAssignments));

      // Load or seed submissions
      const storedSubmissions = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      const loadedSubmissions = storedSubmissions
        ? JSON.parse(storedSubmissions)
        : initialSubmissions;
      if (!storedSubmissions)
        localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(initialSubmissions));

      // Load current user or default to first student
      const storedCurrentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      const loadedCurrentUser = storedCurrentUser
        ? JSON.parse(storedCurrentUser)
        : loadedUsers.find((u) => u.role === 'student');

      // Simulate initial loading delay
      await simulateApiCall(null, 600);

      setUsers(loadedUsers);
      setAssignments(loadedAssignments);
      setSubmissions(loadedSubmissions);
      setCurrentUser(loadedCurrentUser);
      setLoading(false);
    };

    initData();
  }, []);

  // ===== Persist state changes to localStorage =====
  useEffect(() => {
    if (!loading && assignments.length >= 0) {
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
    }
  }, [assignments, loading]);

  useEffect(() => {
    if (!loading && submissions.length >= 0) {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
    }
  }, [submissions, loading]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // ===== Toast Notifications =====
  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = generateId('toast');
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    // Auto-remove after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ===== User Management =====
  const switchUser = useCallback(
    async (userId) => {
      setLoading(true);
      const user = users.find((u) => u.id === userId);
      if (user) {
        await simulateApiCall(null, 300);
        setCurrentUser(user);
        addToast(`Switched to ${user.name} (${user.role})`, 'info');
      }
      setLoading(false);
    },
    [users, addToast]
  );

  // ===== Assignment CRUD =====

  /**
   * Creates a new assignment (admin only).
   */
  const createAssignment = useCallback(
    async (assignmentData) => {
      setLoading(true);
      const newAssignment = {
        id: generateId('asgn'),
        ...assignmentData,
        createdBy: currentUser.id,
        createdAt: new Date().toISOString(),
      };

      await simulateApiCall(null, 500);
      setAssignments((prev) => [...prev, newAssignment]);
      setLoading(false);
      addToast('Assignment created successfully!', 'success');
      return newAssignment;
    },
    [currentUser, addToast]
  );

  /**
   * Updates an existing assignment (admin only).
   */
  const updateAssignment = useCallback(
    async (assignmentId, updates) => {
      setLoading(true);
      await simulateApiCall(null, 400);
      setAssignments((prev) =>
        prev.map((a) => (a.id === assignmentId ? { ...a, ...updates } : a))
      );
      setLoading(false);
      addToast('Assignment updated successfully!', 'success');
    },
    [addToast]
  );

  /**
   * Deletes an assignment and its associated submissions (admin only).
   */
  const deleteAssignment = useCallback(
    async (assignmentId) => {
      setLoading(true);
      await simulateApiCall(null, 400);
      setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
      // Also remove associated submissions
      setSubmissions((prev) => prev.filter((s) => s.assignmentId !== assignmentId));
      setLoading(false);
      addToast('Assignment deleted successfully.', 'warning');
    },
    [addToast]
  );

  // ===== Submission Management =====

  /**
   * Submits an assignment for the current student (double-verification step 2).
   */
  const submitAssignment = useCallback(
    async (assignmentId) => {
      setLoading(true);
      const newSubmission = {
        id: generateId('sub'),
        assignmentId,
        studentId: currentUser.id,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
      };

      await simulateApiCall(null, 600);
      setSubmissions((prev) => [...prev, newSubmission]);
      setLoading(false);
      addToast('Assignment submitted successfully! 🎉', 'success');
      return newSubmission;
    },
    [currentUser, addToast]
  );

  /**
   * Checks if a specific student has submitted a specific assignment.
   */
  const getSubmissionStatus = useCallback(
    (assignmentId, studentId) => {
      const sid = studentId || currentUser?.id;
      return submissions.find(
        (s) => s.assignmentId === assignmentId && s.studentId === sid
      );
    },
    [submissions, currentUser]
  );

  // ===== Context Value =====
  const value = {
    // State
    users,
    currentUser,
    assignments,
    submissions,
    loading,
    toasts,

    // Actions
    switchUser,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    submitAssignment,
    getSubmissionStatus,
    addToast,
    removeToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
