import Skeleton from './Skeleton';

const CoursePageSkeleton = () => (
  <div className="max-w-4xl mx-auto animate-fade-in">
    {/* Breadcrumb */}
    <div className="flex items-center gap-1.5 mb-6">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-3" />
      <Skeleton className="h-4 w-24" />
    </div>

    {/* Course Header Card */}
    <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border-light)] shadow-[var(--shadow-sm)] p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-6 w-72 mb-2" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
        <Skeleton className="h-[72px] w-[72px] rounded-full" />
      </div>
    </div>

    {/* Assignment Cards */}
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-xl" />
      ))}
    </div>
  </div>
);

export default CoursePageSkeleton;
