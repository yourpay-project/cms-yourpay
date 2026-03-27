import type { FC } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronLeft, Copy } from "lucide-react";
import { toast } from "sonner";

import { Badge, Button } from "@/shared/ui";

import type { KycSubmissionDetailPageHeaderProps } from "./KycSubmissionDetailPageHeader.type";

const STATUS_VARIANT_BY_STATUS: Record<string, "success" | "warning" | "destructive" | "default"> = {
  APPROVED: "success",
  VERIFIED: "success",
  PENDING: "warning",
  REVIEW: "warning",
  REJECTED: "destructive",
  FAILED: "destructive",
};

/**
 * Header for `/kyc-submission/$id`.
 */
export const KycSubmissionDetailPageHeader: FC<KycSubmissionDetailPageHeaderProps> = ({
  id,
  fullname,
  currentStatus,
  eplStatusClass,
  isStatusEditable,
  onOpenStatusModal,
}) => {
  const normalizedStatus = String(currentStatus ?? "").trim().toUpperCase();
  const statusVariant = STATUS_VARIANT_BY_STATUS[normalizedStatus] ?? "default";
  const isPendingStatus = currentStatus === "pending";
  const canOpenStatusModal = isPendingStatus && isStatusEditable;
  const statusButtonCursorClassName = isPendingStatus ? "cursor-pointer" : "cursor-default";

  const copySubmissionId = () => {
    void navigator.clipboard.writeText(id).then(() => {
      toast.success("ID copied to clipboard.");
    });
  };

  return (
    <div className="flex w-full min-w-0 max-w-full shrink-0 flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 items-center gap-2">
        <Button asChild variant="ghost" size="icon" type="button" className="h-8 w-8 shrink-0">
          <Link to="/kyc-submission" aria-label="Back to list">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="min-w-0 text-xl font-semibold leading-tight break-words">
          KYC Submission Detail
        </h2>
      </div>

      <div className="flex w-full min-w-0 flex-col items-end gap-1 md:w-auto">
        <div className="flex w-full min-w-0 items-center justify-end gap-2 md:w-auto">
          {fullname ? <p className="min-w-0 truncate text-sm font-medium">{fullname}</p> : null}
          {fullname ? <span className="text-muted-foreground">-</span> : null}

          <button
            type="button"
            className={`inline-flex items-center gap-1 ${statusButtonCursorClassName}`}
            onClick={() => {
              if (canOpenStatusModal) {
                onOpenStatusModal();
              }
            }}
            aria-label="Change KYC status"
          >
            <Badge variant={statusVariant} className={`${eplStatusClass} uppercase`}>
              {normalizedStatus || "-"}
            </Badge>
            {isPendingStatus ? <ChevronDown className="h-3 w-3 text-muted-foreground" /> : null}
          </button>
        </div>

        <div className="flex max-w-full items-center justify-end gap-1.5 text-xs text-muted-foreground">
          <span className="truncate font-mono" title={id}>
            ID: {id}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
            aria-label="Copy submission ID"
            onClick={copySubmissionId}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

