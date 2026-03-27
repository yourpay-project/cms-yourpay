import type { FC, ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

import { Button } from "./button";

export interface DetailPageHeaderProps {
  title: string;
  backTo: string;
  backAriaLabel: string;
  rightContent?: ReactNode;
  className?: string;
}

/**
 * Reusable detail-page header with back action and title.
 *
 * @param props Header title, back navigation target, and optional right-side content.
 * @returns Detail-page header layout.
 */
export const DetailPageHeader: FC<DetailPageHeaderProps> = ({
  title,
  backTo,
  backAriaLabel,
  rightContent,
  className,
}) => {
  return (
    <div className={className ?? "flex flex-col gap-3 md:flex-row md:items-center md:justify-between"}>
      <div className="flex min-w-0 items-center gap-2">
        <Button asChild variant="ghost" size="icon" type="button" className="h-8 w-8 shrink-0">
          <Link to={backTo} aria-label={backAriaLabel}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="min-w-0 text-xl font-semibold leading-tight break-words">{title}</h2>
      </div>
      {rightContent}
    </div>
  );
};
