import { useAppContext } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';

const icons = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
};

const colors = {
  success: { bg: 'bg-[var(--color-success-light)]', text: 'text-[var(--color-success)]', bar: 'bg-[var(--color-success)]' },
  warning: { bg: 'bg-[var(--color-warning-light)]', text: 'text-[var(--color-warning)]', bar: 'bg-[var(--color-warning)]' },
  error: { bg: 'bg-[var(--color-danger-light)]', text: 'text-[var(--color-danger)]', bar: 'bg-[var(--color-danger)]' },
  info: { bg: 'bg-[var(--color-info-light)]', text: 'text-[var(--color-info)]', bar: 'bg-[var(--color-info)]' },
};

const ToastContainer = () => {
  const { toasts, removeToast } = useAppContext();

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto z-[100] flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type] || icons.info;
          const color = colors[toast.type] || colors.info;
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="bg-[var(--color-bg-card)] rounded-xl shadow-lg border border-[var(--color-border-light)] overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 py-3">
                <div className={`w-8 h-8 rounded-lg ${color.bg} flex items-center justify-center shrink-0`}>
                  <Icon size={16} className={color.text} />
                </div>
                <p className="text-sm text-[var(--color-text-primary)] flex-1">{toast.message}</p>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="p-1 rounded-md hover:bg-[var(--color-bg-hover)] transition-colors shrink-0"
                >
                  <X size={14} className="text-[var(--color-text-muted)]" />
                </button>
              </div>
              <div className="h-0.5 bg-[var(--color-border-light)]">
                <div
                  className={`h-full ${color.bar}`}
                  style={{ animation: `toast-progress ${toast.duration}ms linear forwards` }}
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
