import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  STORAGE_KEYS,
  initialUsers,
  initialCourses,
  initialAssignments,
  initialGroups,
  initialAcknowledgments,
  initialSemesters,
} from '../data/mockData';
import { generateId, simulateApiCall, generateMockJWT } from '../utils/helpers';

const AppContext = createContext(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};

export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [groups, setGroups] = useState([]);
  const [acknowledgments, setAcknowledgments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [activeSemester, setActiveSemester] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_SEMESTER);
    return stored ? JSON.parse(stored) : 'Spring 2026';
  });
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('joineazy_darkMode');
    return stored ? JSON.parse(stored) : false;
  });

  // Initialize
  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const load = (key, fallback) => {
        const stored = localStorage.getItem(key);
        if (stored) return JSON.parse(stored);
        localStorage.setItem(key, JSON.stringify(fallback));
        return fallback;
      };

      const loadedUsers = load(STORAGE_KEYS.USERS, initialUsers);
      const loadedCourses = load(STORAGE_KEYS.COURSES, initialCourses);
      const loadedAssignments = load(STORAGE_KEYS.ASSIGNMENTS, initialAssignments);
      const loadedGroups = load(STORAGE_KEYS.GROUPS, initialGroups);
      const loadedAcks = load(STORAGE_KEYS.ACKNOWLEDGMENTS, initialAcknowledgments);

      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);

      await simulateApiCall(null, 400);

      setUsers(loadedUsers);
      setCourses(loadedCourses);
      setAssignments(loadedAssignments);
      setGroups(loadedGroups);
      setAcknowledgments(loadedAcks);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setCurrentUser(JSON.parse(storedUser));
      }

      setLoading(false);
    };
    init();
  }, []);

  // Persist
  useEffect(() => {
    if (!loading) localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  }, [assignments, loading]);

  useEffect(() => {
    if (!loading) localStorage.setItem(STORAGE_KEYS.ACKNOWLEDGMENTS, JSON.stringify(acknowledgments));
  }, [acknowledgments, loading]);

  useEffect(() => {
    if (!loading) localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
  }, [groups, loading]);

  useEffect(() => {
    if (!loading) localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  }, [courses, loading]);

  useEffect(() => {
    if (!loading) localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users, loading]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SEMESTER, JSON.stringify(activeSemester));
  }, [activeSemester]);

  // Dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('joineazy_darkMode', JSON.stringify(next));
      return next;
    });
  }, []);

  // Toasts
  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = generateId('toast');
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Auth
  const login = useCallback(async (email, password) => {
    await simulateApiCall(null, 500);
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid email or password');
    const newToken = generateMockJWT(user.id);
    setCurrentUser(user);
    setToken(newToken);
    localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    addToast(`Welcome back, ${user.name}!`, 'success');
    return user;
  }, [users, addToast]);

  const register = useCallback(async (userData) => {
    await simulateApiCall(null, 500);
    const exists = users.find((u) => u.email === userData.email);
    if (exists) throw new Error('An account with this email already exists');
    const newUser = {
      id: generateId(userData.role === 'professor' ? 'prof' : 'stu'),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      avatar: userData.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
      ...(userData.role === 'professor' ? { department: 'General' } : { semester: 'Spring 2026' }),
    };
    setUsers((prev) => [...prev, newUser]);
    const newToken = generateMockJWT(newUser.id);
    setCurrentUser(newUser);
    setToken(newToken);
    localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    addToast('Account created successfully!', 'success');
    return newUser;
  }, [users, addToast]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }, []);

  // Courses
  const getCoursesForUser = useCallback(() => {
    if (!currentUser) return [];
    const semesterCourses = courses.filter((c) => c.semester === activeSemester);
    if (currentUser.role === 'professor') {
      return semesterCourses.filter((c) => c.professorId === currentUser.id);
    }
    return semesterCourses.filter((c) => c.studentIds.includes(currentUser.id));
  }, [courses, currentUser, activeSemester]);

  // Assignments
  const getAssignmentsForCourse = useCallback(
    (courseId) => assignments.filter((a) => a.courseId === courseId),
    [assignments]
  );

  const createAssignment = useCallback(async (data) => {
    const newAssignment = {
      id: generateId('asgn'),
      ...data,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
    };
    await simulateApiCall(null, 400);
    setAssignments((prev) => [...prev, newAssignment]);
    addToast('Assignment created successfully!', 'success');
    return newAssignment;
  }, [currentUser, addToast]);

  const updateAssignment = useCallback(async (id, updates) => {
    await simulateApiCall(null, 300);
    setAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    addToast('Assignment updated!', 'success');
  }, [addToast]);

  const deleteAssignment = useCallback(async (id) => {
    await simulateApiCall(null, 300);
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    setAcknowledgments((prev) => prev.filter((a) => a.assignmentId !== id));
    addToast('Assignment deleted.', 'warning');
  }, [addToast]);

  // Groups
  const getGroupForStudent = useCallback(
    (courseId, studentId) => {
      const sid = studentId || currentUser?.id;
      return groups.find((g) => g.courseId === courseId && g.memberIds.includes(sid));
    },
    [groups, currentUser]
  );

  const getGroupsForCourse = useCallback(
    (courseId) => groups.filter((g) => g.courseId === courseId),
    [groups]
  );

  const createGroup = useCallback(async (data) => {
    await simulateApiCall(null, 300);
    const newGroup = { id: generateId('grp'), ...data };
    setGroups((prev) => [...prev, newGroup]);
    addToast('Group created!', 'success');
    return newGroup;
  }, [addToast]);

  const joinGroup = useCallback(async (groupId) => {
    await simulateApiCall(null, 300);
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, memberIds: [...g.memberIds, currentUser.id] } : g
      )
    );
    addToast('Joined group successfully!', 'success');
  }, [currentUser, addToast]);

  const leaveGroup = useCallback(async (groupId) => {
    await simulateApiCall(null, 300);
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, memberIds: g.memberIds.filter((id) => id !== currentUser.id) }
          : g
      )
    );
    addToast('Left group.', 'info');
  }, [currentUser, addToast]);

  // Acknowledgments
  const getAcknowledgment = useCallback(
    (assignmentId, studentId) => {
      const sid = studentId || currentUser?.id;
      return acknowledgments.find(
        (a) => a.assignmentId === assignmentId && a.studentId === sid
      );
    },
    [acknowledgments, currentUser]
  );

  const acknowledgeAssignment = useCallback(
    async (assignmentId, assignment) => {
      await simulateApiCall(null, 400);

      if (assignment.submissionType === 'group') {
        const group = groups.find(
          (g) => g.courseId === assignment.courseId && g.memberIds.includes(currentUser.id)
        );
        if (!group) {
          addToast('You must be in a group to acknowledge this assignment.', 'error');
          return;
        }
        if (group.leaderId !== currentUser.id) {
          addToast('Only the group leader can acknowledge group assignments.', 'error');
          return;
        }
        const newAcks = group.memberIds
          .filter((mid) => !acknowledgments.find((a) => a.assignmentId === assignmentId && a.studentId === mid))
          .map((mid) => ({
            id: generateId('ack'),
            assignmentId,
            studentId: mid,
            acknowledgedAt: new Date().toISOString(),
            acknowledgedBy: currentUser.id,
          }));
        setAcknowledgments((prev) => [...prev, ...newAcks]);
        addToast('Assignment acknowledged for your entire group!', 'success');
      } else {
        const newAck = {
          id: generateId('ack'),
          assignmentId,
          studentId: currentUser.id,
          acknowledgedAt: new Date().toISOString(),
          acknowledgedBy: currentUser.id,
        };
        setAcknowledgments((prev) => [...prev, newAck]);
        addToast('Assignment acknowledged!', 'success');
      }
    },
    [currentUser, groups, acknowledgments, addToast]
  );

  // Analytics
  const getAnalyticsForProfessor = useCallback(() => {
    const myCourses = courses.filter((c) => c.professorId === currentUser?.id && c.semester === activeSemester);
    const myAssignments = assignments.filter((a) => myCourses.some((c) => c.id === a.courseId));

    const allStudentIds = [...new Set(myCourses.flatMap((c) => c.studentIds))];
    const studentProgress = allStudentIds.map((sid) => {
      const student = users.find((u) => u.id === sid);
      const relevantAssignments = myAssignments.filter((a) => {
        const c = myCourses.find((c) => c.id === a.courseId);
        return c && c.studentIds.includes(sid);
      });
      const acked = relevantAssignments.filter((a) =>
        acknowledgments.find((ak) => ak.assignmentId === a.id && ak.studentId === sid)
      ).length;
      return {
        student,
        total: relevantAssignments.length,
        acked,
        percentage: relevantAssignments.length > 0 ? Math.round((acked / relevantAssignments.length) * 100) : 0,
      };
    });

    const assignmentCompletion = myAssignments.map((a) => {
      const course = myCourses.find((c) => c.id === a.courseId);
      const total = course ? course.studentIds.length : 0;
      const acked = acknowledgments.filter((ak) => ak.assignmentId === a.id && (course ? course.studentIds.includes(ak.studentId) : false)).length;
      return { assignment: a, course, total, acked, percentage: total > 0 ? Math.round((acked / total) * 100) : 0 };
    });

    const groupAssignments = myAssignments.filter((a) => a.submissionType === 'group');
    const groupStatus = groupAssignments.map((a) => {
      const courseGroups = groups.filter((g) => g.courseId === a.courseId);
      return {
        assignment: a,
        groups: courseGroups.map((g) => {
          const memberAcks = g.memberIds.filter((mid) =>
            acknowledgments.find((ak) => ak.assignmentId === a.id && ak.studentId === mid)
          ).length;
          return { group: g, total: g.memberIds.length, acked: memberAcks, status: memberAcks === g.memberIds.length ? 'complete' : memberAcks > 0 ? 'partial' : 'none' };
        }),
      };
    });

    return { studentProgress, assignmentCompletion, groupStatus, totalCourses: myCourses.length, totalAssignments: myAssignments.length };
  }, [currentUser, courses, assignments, acknowledgments, users, groups, activeSemester]);

  const value = {
    users, currentUser, token, courses, assignments, groups, acknowledgments, loading, toasts,
    activeSemester, setActiveSemester, initialSemesters, darkMode, toggleDarkMode,
    login, register, logout,
    getCoursesForUser, getAssignmentsForCourse,
    createAssignment, updateAssignment, deleteAssignment,
    getGroupForStudent, getGroupsForCourse, createGroup, joinGroup, leaveGroup,
    getAcknowledgment, acknowledgeAssignment,
    getAnalyticsForProfessor,
    addToast, removeToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
