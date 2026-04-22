import Skeleton from './Skeleton';

const DashboardSkeleton = () => (
  <div className="max-w-6xl mx-auto animate-fade-in">
    {/* Header */}
    <div className="mb-8">
      <Skeleton className="h-8 w-64 mb-2" />
      <Skeleton className="h-4 w-48" />
    </div>

    {/* Stat Cards */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-24 rounded-xl" />
      ))}
    </div>

    {/* Section Title */}
    <Skeleton className="h-6 w-40 mb-4" />

    {/* Course Cards */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-48 rounded-xl" />
      ))}
    </div>
  </div>
);

export default DashboardSkeleton;
