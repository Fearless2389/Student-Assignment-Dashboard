import Modal from './ui/Modal';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirm', danger = false, loading = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${danger ? 'bg-[var(--color-danger-light)]' : 'bg-[var(--color-warning-light)]'}`}>
            <AlertTriangle size={20} className={danger ? 'text-[var(--color-danger)]' : 'text-[var(--color-warning)]'} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[var(--color-text-primary)]">{title}</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50 ${
              danger
                ? 'bg-[var(--color-danger)] hover:bg-red-600'
                : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]'
            }`}
          >
            {loading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
