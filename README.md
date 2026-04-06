# AssignDash — Assignment & Review Dashboard

A modern, SaaS-style assignment tracking and review dashboard built for university classrooms. The application provides two distinct environments: a **Student Dashboard** for tracking progression and submitting work, and a **Professor Console** for managing assignments, evaluating class cohorts, and monitoring submission rates.

Built with **React**, **Vite**, **Tailwind CSS v4**, and **Framer Motion**, the UI heavily focuses on clean visual hierarchy, generous whitespace, and responsive layouts inspired by leading platforms like Linear and Vercel.

The website can be accessed at : https://student-assignment-dashboard-mocha.vercel.app/
---

##  Environment Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Installation
Clone the repository (if applicable) and install the dependencies:
```bash
npm install
```

### 2. Local Development
Fire up the local Vite development server:
```bash
npm run dev
```
The application will launch on `http://localhost:5174` (or whatever port Vite provisions).

### 3. Production Build
To create an optimized production bundle:
```bash
npm run build
npm run preview
```

> **Note on Data:** This application operates completely entirely on the frontend using seeded dummy data. All configurations, user switching, and assignment interactions are persisted dynamically across sessions using the browser's `localStorage`.

---

##  Architecture Overview

The system is configured as a pure Client-Side Rendered (CSR) Single Page Application (SPA). To bypass the need for a complex backend service during prototyping, it employs a **Mock Local Storage Database Architecture**:

- **Global Context (`AppContext`)**: The heart of the application. It bootstraps the environment asynchronously on mount, fetching records from `localStorage` or seeding default users and assignments from `mockData.js`. 
- **Roles & Routing**: Access control is mock-handled directly through a role property (`student` vs `admin`) on the user JSON object, dictating which dashboard is recursively mounted by `App.jsx`.
- **Component Design**: Heavy lifting is managed by "smart" wrapper dashboards (`AdminDashboard`, `StudentDashboard`) that feed derived properties down to isolated "dumb" UI cards (`AdminAssignmentCard`, `StudentAssignmentCard`).

---

## 📂 Folder Structure Overview

```text
src/
├── components/          # Reusable UI building blocks
│   ├── admin/           # Professor-specific modular views & forms 
│   ├── student/         # Student-specific assignment and progress views
│   ├── Navbar.jsx       # Global navigation and responsive role switching
│   ├── Modal.jsx        # Animated headless wrapper for dialog interactions
│   └── ...              # Other generic UI components (Toasts, Spinners)
├── context/
│   └── AppContext.jsx   # Global Context Provider (State, DB interactions, Auth mock)
├── data/
│   └── mockData.js      # Base schemas, initial users, assignments, & submission records
├── utils/
│   ├── cn.js            # Tailwind merge utility for safe conditional class generation
│   └── helpers.js       # Pure functions for progress metrics and date formatting
├── App.jsx              # Application root, routing router, & error boundaries
├── index.css            # SaaS design system tokens and Tailwind bindings
└── main.jsx             # React entry point
```

---

##  Component Structure & Design Decisions

Detailed documentation regarding the application's clean design philosophy, specific component abstractions, and UX decisions can be found in [DESIGN_DECISIONS.md](./DESIGN_DECISIONS.md).
