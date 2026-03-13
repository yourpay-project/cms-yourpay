import type { FC, HTMLAttributes } from "react";
import { cn } from "@/shared/lib/utils";

export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export const Skeleton: FC<SkeletonProps> = ({ className, ...props }) => (
  <div className={cn("animate-pulse rounded-md bg-muted/50", className)} {...props} />
);

