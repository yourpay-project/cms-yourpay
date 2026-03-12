import { cn } from '@/shared/lib/utils';
import { PageSkeleton } from './page-skeleton';

export interface RouteFallbackProps {
  /** Optional class for the wrapper. */
  className?: string;
}

/**
 * Full-page loading fallback for React Suspense (e.g. when lazy-loading route components).
 * Uses semantic tokens for theme compatibility.
 */
export function RouteFallback({ className }: RouteFallbackProps): JSX.Element {
  return (
    <div
      className={cn(
        'min-h-[50vh] bg-background p-4',
        className,
      )}
      role="status"
      aria-label="Loading"
    >
      <PageSkeleton />
    </div>
  );
}
