import type { FC, FormEvent } from "react";
import { useMemo, useState } from "react";

import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { Button, Input } from "@/shared/ui";

import type { UserCloseConfirmModalProps } from "./UserCloseConfirmModal.type";

/**
 * Confirmation modal for terminating a customer account.
 */
export const UserCloseConfirmModal: FC<UserCloseConfirmModalProps> = ({
  onClose,
  customerId,
}) => {
  const formId = "user-close-confirm-form";
  const [operatorPassword, setOperatorPassword] = useState("");
  const [reason, setReason] = useState("");
  const [confirmChecked, setConfirmChecked] = useState(false);

  const canSubmit = useMemo(
    () => operatorPassword.trim().length > 0 && reason.trim().length >= 10 && confirmChecked,
    [confirmChecked, operatorPassword, reason],
  );

  const handleConfirm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    toast.info(`TODO: close user flow for ${customerId}`, {
      description: "Confirm action is not connected to backend yet.",
    });
    onClose();
  };

  return (
    <form id={formId} className="space-y-4 pb-1 pt-2" onSubmit={handleConfirm}>
      <div className="flex flex-col items-center gap-2 text-center">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-destructive/15 text-destructive">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Terminate Customer Account</h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            This action is IRREVERSIBLE and will permanently delete ALL customer data including
            transactions, devices, and personal information.
          </p>
        </div>

        <div className="space-y-3">
          {/* Hidden username helps browser autofill + avoids accessibility warnings for password-only forms */}
          <input
            type="text"
            name="username"
            autoComplete="username"
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
          />
          <Input
            label="Operator Password*"
            type="password"
            autoComplete="current-password"
            name="operator_password"
            value={operatorPassword}
            onChange={(event) => setOperatorPassword(event.target.value)}
            helperText="Enter your operator password to confirm this action"
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Termination Reason*</label>
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring"
            />
            <p className="text-[11px] text-muted-foreground">
              Please provide a detailed reason for terminating this customer account
            </p>
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={confirmChecked}
              onChange={(event) => setConfirmChecked(event.target.checked)}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            I understand this action cannot be undone
          </label>
        </div>

      <div className="flex items-center justify-end gap-2 pb-5 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="destructive" disabled={!canSubmit}>
          Confirm
        </Button>
      </div>
    </form>
  );
};

