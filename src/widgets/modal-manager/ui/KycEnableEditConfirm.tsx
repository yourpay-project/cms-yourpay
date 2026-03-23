import type { FC } from "react";
import { Button } from "@/shared/ui";

import type { KycEnableEditConfirmModalProps } from "./KycEnableEditConfirmModal.type";

/**
 * Confirmation modal for enabling KYC editing mode.
 */
export const KycEnableEditConfirm: FC<KycEnableEditConfirmModalProps> = ({ open, onClose, onConfirm }) => {
  // `open` is controlled by ModalContainer; this content only renders actions.
  void open;

  return (
    <div className="flex items-center justify-end gap-2 pb-5 pt-4">
      <Button type="button" variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button
        type="button"
        variant="default"
        onClick={() => {
          onConfirm?.();
          onClose();
        }}
      >
        Yes, Enable Editing
      </Button>
    </div>
  );
};
