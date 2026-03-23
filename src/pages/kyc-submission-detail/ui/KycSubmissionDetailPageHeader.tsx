import type { FC } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronLeft, Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/ui";

import type { KycSubmissionDetailPageHeaderProps } from "./KycSubmissionDetailPageHeader.type";

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
          KYC Submission Detail{fullname ? ` (${fullname})` : ""}
        </h2>
      </div>

      <div className="flex w-full min-w-0 flex-col items-end gap-1 md:w-auto">
        <button
          type="button"
          className={`inline-flex w-auto max-w-full items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium uppercase ${eplStatusClass} ${
            currentStatus === "pending" ? "cursor-pointer" : "cursor-default"
          }`}
          onClick={() => {
            if (currentStatus === "pending" && isStatusEditable) {
              onOpenStatusModal();
            }
          }}
        >
          {`Status: ${currentStatus}`}
          {currentStatus === "pending" ? <ChevronDown className="h-3 w-3" /> : null}
        </button>
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

