import { cn } from '../../utils/cn';

const Skeleton = ({ className }) => (
  <div className={cn('animate-shimmer rounded-lg', className)} />
);

export default Skeleton;
