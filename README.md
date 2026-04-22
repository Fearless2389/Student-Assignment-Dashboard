# JOineazy - Student Assignment Dashboard

A clean, responsive assignment management dashboard built with React.js and Tailwind CSS. Features role-based views for **students** and **professors**, double-verification submission flow, group leader acknowledgment propagation, semester switching, dark mode, and rich analytics.

## Live Demo

[Deployed on Vercel](https://joineazy-v2.vercel.app)

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework with hooks (useState, useEffect, useMemo, useContext) |
| Tailwind CSS v4 | Utility-first styling via Vite plugin |
| React Router DOM v7 | Client-side routing with protected routes |
| Framer Motion | Page transitions and toast animations |
| Lucide React | Icon library |
| Vite 8 | Build tool and dev server |
| localStorage | Data persistence (no backend required) |

## Setup Instructions

```bash
# Clone the repository
git clone https://github.com/Fearless2389/Student-Assignment-Dashboard.git
cd Student-Assignment-Dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app runs at `http://localhost:5173` by default.

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Professor | neha@university.edu | password123 |
| Professor | raj@university.edu | password123 |
| Student | ruthvik@student.edu | password123 |
| Student | priya@student.edu | password123 |
| Student | arjun@student.edu | password123 |

## Folder Structure

```
src/
├── components/
│   ├── ui/                      # Reusable UI primitives
│   │   ├── CircularProgress.jsx   # SVG ring progress indicator
│   │   ├── CoursePageSkeleton.jsx  # Loading skeleton for course page
│   │   ├── DashboardSkeleton.jsx   # Loading skeleton for dashboard
│   │   ├── Modal.jsx               # Animated modal with backdrop blur
│   │   ├── ProgressBar.jsx         # Configurable progress bar (auto-color)
│   │   ├── Skeleton.jsx            # Base shimmer loading component
│   │   └── ToastContainer.jsx      # Toast notification system
│   ├── layout/                  # Layout components
│   │   ├── AppShell.jsx           # CSS Grid layout (sidebar + content)
│   │   ├── MobileNav.jsx          # Mobile top navigation bar
│   │   ├── PageTransition.jsx     # Framer Motion page wrapper
│   │   └── Sidebar.jsx           # Desktop sidebar + mobile drawer
│   ├── AnalyticsPanel.jsx       # Professor analytics (progress, stats, export)
│   ├── AssignmentCard.jsx       # Student assignment view with acknowledge flow
│   ├── AssignmentForm.jsx       # Create/edit assignment modal form
│   ├── ConfirmDialog.jsx        # Double-confirmation dialog
│   ├── CourseCard.jsx           # Dashboard course card with color accent
│   ├── ErrorBoundary.jsx        # React error boundary
│   ├── ProfessorCard.jsx        # Professor assignment view with student list
│   ├── SemesterSwitcher.jsx     # Semester dropdown with course counts
│   └── StatCard.jsx             # Dashboard statistic card
├── pages/
│   ├── LoginPage.jsx            # Login with demo account buttons
│   ├── RegisterPage.jsx         # Registration with role selection
│   ├── DashboardPage.jsx        # Role-based dashboard
│   ├── CoursePage.jsx           # Assignment list with filters/search/sort
│   └── NotFoundPage.jsx         # 404 page
├── context/
│   └── AppContext.jsx           # Global state (auth, assignments, acks, toasts)
├── data/
│   └── mockData.js              # Mock users, courses, groups, assignments
├── utils/
│   ├── helpers.js               # Date formatting, progress calc, JWT mock
│   └── cn.js                    # clsx + tailwind-merge utility
├── App.jsx                      # Route definitions + protected routes
├── main.jsx                     # Entry point (BrowserRouter + AppProvider)
└── index.css                    # Design system CSS variables + animations
```

## Component Architecture

### Layout Strategy

The app uses **CSS Grid** (`grid-cols-[260px_1fr]`) for the desktop layout, ensuring the sidebar never overlaps content. On mobile (`< md` breakpoint), the sidebar becomes a slide-over drawer with backdrop.

```
Desktop:                    Mobile:
┌──────┬────────────┐      ┌────────────────┐
│      │            │      │  Mobile Nav    │
│ Side │  Content   │      ├────────────────┤
│ bar  │  Area      │      │               │
│      │            │      │  Content Area  │
│      │            │      │               │
└──────┴────────────┘      └────────────────┘
```

### State Management

All state lives in `AppContext` using React Context API:

- **Authentication**: Login/register with mock JWT, role-based routing
- **Data**: Courses, assignments, groups, acknowledgments (persisted to localStorage)
- **UI State**: Dark mode toggle, toast notifications, active semester

### Key Design Decisions

1. **Soft Friendly Design** - Warm color palette (indigo primary, off-white backgrounds) with rounded corners (12px cards, 8px buttons), gentle shadows, and smooth transitions. Inspired by Slack/Discord aesthetics.

2. **CSS Custom Properties for Theming** - All colors defined as CSS variables in `index.css`, enabling full dark mode support by swapping variables under `.dark` class.

3. **Double-Confirmation Flow** - Student assignment acknowledgment requires two steps: click "I have submitted" then confirm in a modal dialog. Prevents accidental submissions.

4. **Group Leader Propagation** - When a group leader acknowledges an assignment, acknowledgment records are created for all group members automatically. Non-leaders see "Acknowledged by [Leader Name]".

5. **URL-Based Filters** - CoursePage uses `useSearchParams` for filter/sort/search state, so filters persist through navigation and can be shared via URL.

6. **Loading Skeletons** - Custom skeleton components (shimmer animation) shown during simulated API loading instead of spinners, providing better perceived performance.

## Features

### Professor Flow
- Dashboard with course overview and analytics tab
- Create, edit, and delete assignments (title, description, deadline, OneDrive link, submission type)
- Per-student progress tracking with expandable student lists
- Assignment completion analytics with progress bars
- Quick export of analytics data to clipboard
- Group submission status overview

### Student Flow
- Dashboard with enrolled courses and upcoming deadlines
- Assignment list with filter pills (all, pending, completed, overdue, individual, group)
- Search and sort functionality
- Double-confirmation acknowledgment ("Yes, I have submitted" + confirm dialog)
- Group leader acknowledgment (leader submits for entire group)
- "Not in a group" warning for unassigned students on group assignments
- Visual progress indicators (progress bars, circular progress, badges)

### Shared Features
- Light/dark mode toggle with localStorage persistence
- Semester switching with filtered course views
- Toast notifications for all user actions
- Fully responsive (375px to 1440px+)
- Animated page transitions
- Error boundary for crash resilience
- 404 page for unknown routes

## Screenshots

### Login Page
Clean centered login with demo account quick-access buttons.

### Student Dashboard
Greeting header, stat cards, upcoming deadlines, and enrolled course grid.

### Professor Dashboard
Course overview with analytics tab showing per-student progress and assignment completion.

### Course Page (Student)
Filter pills, search, sort, and assignment cards with acknowledge flow.

### Course Page (Professor)
Assignment management with expandable student acknowledgment lists.

### Dark Mode
Full dark theme with warm dark backgrounds and adjusted color palette.

### Mobile View
Responsive layout with hamburger menu, slide-over sidebar drawer, and stacked cards.

---

Built with React.js + Tailwind CSS for the JOineazy Frontend Assignment.
