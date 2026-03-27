import type { FC } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/shared/ui";

interface KycVerificationCheckActionsProps {
  isRunning?: boolean;
  onClose: () => void;
  onRunChecks?: () => Promise<void>;
}

/**
 * Footer actions for KYC verification check modal.
 *
 * @param props Running state and modal callbacks.
 * @returns Close/run verification action row.
 */
export const KycVerificationCheckActions: FC<KycVerificationCheckActionsProps> = ({
  isRunning,
  onClose,
  onRunChecks,
}) => {
  const runLabel = isRunning ? "Running..." : "Run Verification Checks";
  const runIcon = isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : null;

  return (
    <div className="flex items-center justify-end gap-2 pb-5 pt-4">
      <Button type="button" variant="outline" onClick={onClose}>
        Close
      </Button>
      <Button
        type="button"
        onClick={() => {
          void onRunChecks?.();
        }}
        disabled={Boolean(isRunning)}
      >
        {runIcon}
        {runLabel}
      </Button>
    </div>
  );
};
