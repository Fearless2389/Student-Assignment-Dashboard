import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { cn } from '../utils/cn';

const TOAST_CONFIG = {
  success: { icon: CheckCircle2, border: 'border-emerald-500/30', bg: 'bg-[#111]', text: 'text-emerald-400' },
  error: { icon: XCircle, border: 'border-red-500/30', bg: 'bg-[#111]', text: 'text-red-400' },
  warning: { icon: AlertTriangle, border: 'border-amber-500/30', bg: 'bg-[#111]', text: 'text-amber-400' },
  info: { icon: Info, border: 'border-indigo-500/30', bg: 'bg-[#111]', text: 'text-indigo-400' },
};

const ToastContainer = () => {
  const { toasts, removeToast } = useAppContext();

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 w-80 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => {
          const config = TOAST_CONFIG[t.type] || TOAST_CONFIG.info;
          return (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              key={t.id}
              className={cn("pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border shadow-xl shadow-black/40", config.bg, config.border)}
            >
              <config.icon size={18} className={config.text} />
              <p className="text-sm font-medium text-[#FAFAFA] flex-1">{t.message}</p>
              <button onClick={() => removeToast(t.id)} className="text-[#71717A] hover:text-white transition-colors">
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
export default ToastContainer;
