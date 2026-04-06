import Modal from './Modal';
import { cn } from '../utils/cn';

const ConfirmDialog = ({
  isOpen, onClose, onConfirm, title, message, confirmText, cancelText, variant = 'danger'
}) => {
  const btnStyles = {
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm',
    success: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm',
    primary: 'btn-primary'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-6">
        <p className="text-slate-500 text-sm leading-relaxed">{message}</p>
        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="btn-ghost">{cancelText}</button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={cn('px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm', btnStyles[variant])}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
export default ConfirmDialog;
