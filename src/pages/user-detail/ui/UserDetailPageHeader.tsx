import type { FC } from "react";
import { Badge, DetailPageHeader } from "@/shared/ui";
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
  const summaryNode =
    fullName !== "-" ? (
      <div className="flex w-full min-w-0 items-center justify-end gap-2 md:ml-auto md:w-auto">
        <p className="min-w-0 truncate text-sm font-medium">{fullName}</p>
        <span className="text-muted-foreground">-</span>
        <Badge variant={statusVariant} className="shrink-0">
          {normalizedStatus}
        </Badge>
      </div>
    ) : null;

  return (
    <DetailPageHeader
      title="Customer Detail"
      backTo="/customers"
      backAriaLabel="Back to list"
      rightContent={summaryNode}
    />
  );
};

