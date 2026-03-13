import type { FC } from "react";
import { Skeleton } from "./skeleton";
import { cn } from "@/shared/lib/utils";

export interface PageSkeletonProps {
  className?: string;
  title?: boolean;
  rows?: number;
}

export const PageSkeleton: FC<PageSkeletonProps> = ({
  className,
  title = true,
  rows = 5,
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      {title && <Skeleton className="h-8 w-48" />}
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
};

