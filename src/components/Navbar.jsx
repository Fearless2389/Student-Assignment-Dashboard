import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Menu, X, ChevronDown, Check, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

const Navbar = () => {
  const { currentUser, users, switchUser } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setUserDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) return null;
  const isAdmin = currentUser.role === 'admin';

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="w-full mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <LayoutDashboard size={16} strokeWidth={2.5} />
            </div>
            <span className="text-lg font-semibold text-slate-900 tracking-tight">AssignDash</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-3">
            <span className={cn('badge', isAdmin ? 'badge-warning' : 'badge-success')}>
              {isAdmin ? 'Professor' : 'Student'}
            </span>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-sm">
                  {currentUser.avatar}
                </div>
                <span className="text-sm font-medium text-slate-700">{currentUser.name}</span>
                <ChevronDown size={14} className={cn('text-slate-400 transition-transform', userDropdownOpen && 'rotate-180')} />
              </button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Signed in as</p>
                      <p className="font-semibold text-slate-900 text-sm">{currentUser.name}</p>
                      <p className="text-xs text-slate-500">{currentUser.email}</p>
                    </div>
                    <div className="p-2">
                      <p className="text-[10px] text-slate-400 px-2 py-2 font-semibold uppercase tracking-wider">Switch Role</p>
                      {users.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => { switchUser(user.id); setUserDropdownOpen(false); }}
                          className={cn(
                            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer',
                            currentUser.id === user.id ? 'bg-indigo-50 text-slate-900' : 'hover:bg-slate-50 text-slate-600'
                          )}
                        >
                          <span className="text-base">{user.avatar}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">{user.name}</p>
                            <p className="text-xs text-slate-400 capitalize">{user.role === 'admin' ? 'Professor' : 'Student'}</p>
                          </div>
                          {currentUser.id === user.id && <Check size={16} className="text-indigo-500" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2 rounded-lg hover:bg-slate-50 transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={20} className="text-slate-500" /> : <Menu size={20} className="text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden border-t border-slate-100 bg-white overflow-hidden">
            <div className="px-6 py-4 space-y-1">
              <div className="flex items-center gap-3 pb-3 mb-2 border-b border-slate-50">
                <span className="text-xl">{currentUser.avatar}</span>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{currentUser.name}</p>
                  <p className="text-xs text-slate-400 capitalize">{isAdmin ? 'Professor' : 'Student'}</p>
                </div>
              </div>
              {users.map((user) => (
                <button key={user.id} onClick={() => { switchUser(user.id); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm text-slate-600 hover:bg-slate-50">
                  <span>{user.avatar}</span>
                  <span className="flex-1">{user.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
