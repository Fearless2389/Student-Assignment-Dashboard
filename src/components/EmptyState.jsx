/**
 * EmptyState.jsx
 * 
 * Displays a helpful empty state message when no data exists.
 * Used in assignment lists, submission views, etc.
 */

const EmptyState = ({
  icon = '📭',
  title = 'Nothing here yet',
  description = 'No items to display at the moment.',
  action = null, // { label, onClick }
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 animate-fade-in">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-lg font-semibold text-slate-200 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 text-center max-w-sm mb-6">
        {description}
      </p>
      {action && (
        <button onClick={action.onClick} className="btn-primary">
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
