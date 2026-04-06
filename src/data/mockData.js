/**
 * mockData.js
 * 
 * Contains all seed data for the assignment management system.
 * This data is loaded into localStorage on first run if no existing data is found.
 * 
 * Data entities:
 * - users: Students and professors
 * - assignments: Created by professors, assigned to students
 * - submissions: Track student submission status per assignment
 */

export const STORAGE_KEYS = {
  USERS: 'assignDash_users_v3',
  ASSIGNMENTS: 'assignDash_assignments_v3',
  SUBMISSIONS: 'assignDash_submissions_v3',
  CURRENT_USER: 'assignDash_currentUser_v3',
};

// ===== Users =====
export const initialUsers = [
  {
    id: 'prof-001',
    name: 'Dr. Neha Bharil',
    email: 'neha.bharil@university.edu',
    role: 'admin',
    avatar: '👩‍🏫',
    department: 'Computer Science',
  },
  {
    id: 'prof-002',
    name: 'Om Prakash',
    email: 'om.prakash@university.edu',
    role: 'admin',
    avatar: '👨‍🏫',
    department: 'Data Science',
  },
  {
    id: 'stu-001',
    name: 'Ruthvik Reddy',
    email: 'ruthvik.r@student.edu',
    role: 'student',
    avatar: '👨‍🎓',
    year: 'Junior',
  },
  {
    id: 'stu-002',
    name: 'Priya Sharma',
    email: 'priya.s@student.edu',
    role: 'student',
    avatar: '👩‍🎓',
    year: 'Senior',
  },
  {
    id: 'stu-003',
    name: 'Anirvesh Naidu',
    email: 'anirvesh.n@student.edu',
    role: 'student',
    avatar: '👨‍💻',
    year: 'Sophomore',
  },
  {
    id: 'stu-004',
    name: 'Aryan Goud',
    email: 'aryan.g@student.edu',
    role: 'student',
    avatar: '👩‍💻',
    year: 'Junior',
  },
  {
    id: 'stu-005',
    name: 'Srikar Karthik',
    email: 'srikar.k@student.edu',
    role: 'student',
    avatar: '🧑‍🎓',
    year: 'Senior',
  },
];

// ===== Assignments =====
export const initialAssignments = [
  {
    id: 'asgn-001',
    title: 'React Component Architecture',
    description:
      'Build a modular React application demonstrating component composition, props drilling vs context, and custom hooks. The project should include at least 5 reusable components with proper TypeScript interfaces.',
    dueDate: '2026-04-15',
    driveLink: 'https://drive.google.com/drive/folders/react-component-arch',
    createdBy: 'prof-001',
    assignedTo: ['stu-001', 'stu-002', 'stu-003', 'stu-004', 'stu-005'],
    createdAt: '2026-03-20T10:00:00Z',
  },
  {
    id: 'asgn-002',
    title: 'Data Visualization Dashboard',
    description:
      'Create an interactive dashboard using D3.js or Chart.js to visualize a dataset of your choice. Include at least 3 different chart types, filtering capabilities, and responsive design.',
    dueDate: '2026-04-20',
    driveLink: 'https://drive.google.com/drive/folders/data-viz-dashboard',
    createdBy: 'prof-001',
    assignedTo: ['stu-001', 'stu-003', 'stu-005'],
    createdAt: '2026-03-22T14:30:00Z',
  },
  {
    id: 'asgn-003',
    title: 'REST API Design & Documentation',
    description:
      'Design a RESTful API for a library management system. Provide complete OpenAPI/Swagger documentation, endpoint descriptions, request/response schemas, and authentication strategy.',
    dueDate: '2026-04-10',
    driveLink: 'https://drive.google.com/drive/folders/rest-api-design',
    createdBy: 'prof-001',
    assignedTo: ['stu-002', 'stu-004'],
    createdAt: '2026-03-18T09:00:00Z',
  },
  {
    id: 'asgn-004',
    title: 'Machine Learning Model Evaluation',
    description:
      'Train and evaluate at least 3 ML models on the provided dataset. Compare accuracy, precision, recall, and F1-score. Write a comprehensive report analyzing model performance and trade-offs.',
    dueDate: '2026-04-25',
    driveLink: 'https://drive.google.com/drive/folders/ml-model-eval',
    createdBy: 'prof-002',
    assignedTo: ['stu-001', 'stu-002', 'stu-005'],
    createdAt: '2026-03-25T11:00:00Z',
  },
  {
    id: 'asgn-005',
    title: 'Database Schema Design',
    description:
      'Design a normalized database schema for an e-commerce platform. Include ER diagrams, table definitions, indexing strategy, and sample queries for common operations.',
    dueDate: '2026-04-12',
    driveLink: 'https://drive.google.com/drive/folders/db-schema-design',
    createdBy: 'prof-002',
    assignedTo: ['stu-003', 'stu-004', 'stu-005'],
    createdAt: '2026-03-19T16:00:00Z',
  },
];

// ===== Submissions =====
export const initialSubmissions = [
  {
    id: 'sub-001',
    assignmentId: 'asgn-001',
    studentId: 'stu-002',
    status: 'submitted',
    submittedAt: '2026-04-05T18:30:00Z',
  },
  {
    id: 'sub-002',
    assignmentId: 'asgn-003',
    studentId: 'stu-002',
    status: 'submitted',
    submittedAt: '2026-04-04T10:15:00Z',
  },
  {
    id: 'sub-003',
    assignmentId: 'asgn-001',
    studentId: 'stu-005',
    status: 'submitted',
    submittedAt: '2026-04-06T09:00:00Z',
  },
  {
    id: 'sub-004',
    assignmentId: 'asgn-005',
    studentId: 'stu-004',
    status: 'submitted',
    submittedAt: '2026-04-03T14:45:00Z',
  },
];
