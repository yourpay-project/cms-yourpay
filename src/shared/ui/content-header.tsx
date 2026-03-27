import type { FC, ReactNode } from "react";

import { cn } from "@/shared/lib";

export interface ContentHeaderProps {
  title: string;
  trailingComponent?: ReactNode;
  children?: ReactNode;
  className?: string;
  titleClassName?: string;
}

/**
 * Generic content header with title, trailing slot, and optional body content.
 *
 * @param props Header title, trailing slot, and optional children.
 * @returns Reusable content header block.
 */
export const ContentHeader: FC<ContentHeaderProps> = ({
  title,
  trailingComponent,
  children,
  className,
  titleClassName,
}) => {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex min-w-0 items-center justify-between gap-2">
        <h2 className={cn("min-w-0 text-xl font-semibold leading-tight break-words", titleClassName)}>
          {title}
        </h2>
        {trailingComponent}
      </div>
      {children}
    </div>
  );
};
