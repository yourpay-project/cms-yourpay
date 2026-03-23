import type { FC } from "react";
import { Button } from "@/shared/ui";

import type { KycGenerateOcrConfirmModalProps } from "./KycGenerateOcrConfirmModal.type";

/**
 * Confirmation modal for triggering OCR-based KYC data generation.
 */
export const KycGenerateOcrConfirm: FC<KycGenerateOcrConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
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
        Yes, Generate from OCR
      </Button>
    </div>
  );
};
