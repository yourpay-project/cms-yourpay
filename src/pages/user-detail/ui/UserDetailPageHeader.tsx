import type { FC } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Badge, Button } from "@/shared/ui";
import type { StatusVariant } from "./user-detail-page-view-model";

interface UserDetailPageHeaderProps {
  fullName: string;
  normalizedStatus: string;
  statusVariant: StatusVariant;
}

/**
 * Header section for customer detail page.
 *
 * @param props - {@link UserDetailPageHeaderProps}
 * @returns Back action and customer status summary.
 */
export const UserDetailPageHeader: FC<UserDetailPageHeaderProps> = ({
  fullName,
  normalizedStatus,
  statusVariant,
}) => {
  let summaryNode: React.ReactNode = null;
  if (fullName !== "-") {
    summaryNode = (
      <div className="flex w-full min-w-0 items-center justify-end gap-2 md:ml-auto md:w-auto">
        <p className="min-w-0 truncate text-sm font-medium">{fullName}</p>
        <span className="text-muted-foreground">-</span>
        <Badge variant={statusVariant} className="shrink-0">
          {normalizedStatus}
        </Badge>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="icon" type="button" className="h-8 w-8">
          <Link to="/customers" aria-label="Back to list">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-xl font-semibold">Customer Detail</h2>
      </div>
      {summaryNode}
    </div>
  );
};

