import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import ToastContainer from '../ui/ToastContainer';
import PageTransition from './PageTransition';

const AppShell = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[var(--color-bg-app)]">
      {/* Desktop: CSS Grid layout — sidebar never overlaps content */}
      <div className="hidden md:grid md:grid-cols-[260px_1fr] min-h-screen">
        <Sidebar onClose={() => setSidebarOpen(false)} />
        <main className="p-6 lg:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile: single column with drawer */}
      <div className="md:hidden min-h-screen flex flex-col">
        <MobileNav onMenuOpen={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Sidebar Drawer */}
      <Sidebar
        mobile
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <ToastContainer />
    </div>
  );
};

export default AppShell;
