/**
 * ProgressBar.jsx
 * 
 * Visual progress indicator with:
 * - Animated fill bar with gradient
 * - Percentage label
 * - Configurable size and color
 */

const ProgressBar = ({ percentage = 0, label = '', showPercentage = true, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  // Determine color based on percentage
  const getGradient = () => {
    if (percentage >= 80) return 'from-emerald-500 to-emerald-400';
    if (percentage >= 50) return 'from-blue-500 to-indigo-400';
    if (percentage >= 25) return 'from-amber-500 to-yellow-400';
    return 'from-red-500 to-orange-400';
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-xs text-slate-400">{label}</span>}
          {showPercentage && (
            <span className="text-xs font-semibold text-slate-300">{percentage}%</span>
          )}
        </div>
      )}
      <div className={`w-full rounded-full bg-slate-700/50 overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${getGradient()} transition-all duration-700 ease-out`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
