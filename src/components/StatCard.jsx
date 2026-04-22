import { cn } from '../utils/cn';

const StatCard = ({ icon: Icon, label, value, color = 'primary', subtitle }) => {
  const bgColors = {
    primary: 'bg-[var(--color-primary-light)]',
    success: 'bg-[var(--color-success-light)]',
    warning: 'bg-[var(--color-warning-light)]',
    danger: 'bg-[var(--color-danger-light)]',
    info: 'bg-[var(--color-info-light)]',
  };

  const iconColors = {
    primary: 'text-[var(--color-primary)]',
    success: 'text-[var(--color-success)]',
    warning: 'text-[var(--color-warning)]',
    danger: 'text-[var(--color-danger)]',
    info: 'text-[var(--color-info)]',
  };

  return (
    <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border-light)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 transition-all p-5">
      <div className="flex items-center gap-3">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', bgColors[color])}>
          <Icon size={20} className={iconColors[color]} />
        </div>
        <div>
          <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">{label}</p>
          <p className="text-xl font-bold text-[var(--color-text-primary)] mt-0.5">{value}</p>
          {subtitle && <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
