import { cn } from '../../utils/cn';

const ProgressBar = ({ value, max = 100, size = 'md', color = 'primary', showLabel = false }) => {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;

  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const barColors = {
    primary: 'bg-[var(--color-primary)]',
    success: 'bg-[var(--color-success)]',
    warning: 'bg-[var(--color-warning)]',
    danger: 'bg-[var(--color-danger)]',
  };

  const autoColor = percentage >= 75 ? 'success' : percentage >= 40 ? 'warning' : 'danger';
  const resolvedColor = color === 'auto' ? autoColor : color;

  return (
    <div className="flex items-center gap-2">
      <div className={cn('flex-1 bg-[var(--color-border-light)] rounded-full overflow-hidden', heights[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', barColors[resolvedColor])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold text-[var(--color-text-secondary)] tabular-nums min-w-[36px] text-right">
          {percentage}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
