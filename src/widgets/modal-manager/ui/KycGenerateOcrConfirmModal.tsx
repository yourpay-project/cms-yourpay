import type { FC } from "react";
import { Modal } from "@/shared/ui/modal";

import type { KycGenerateOcrConfirmModalProps } from "./types";

/**
 * Confirmation modal for triggering OCR-based KYC data generation.
 */
export const KycGenerateOcrConfirmModal: FC<KycGenerateOcrConfirmModalProps> = ({ onClose, onConfirm }) => {
  return (
    <Modal
      open
      onCancel={onClose}
      onOk={() => {
        onConfirm?.();
        onClose();
      }}
      okText="Yes, Generate from OCR"
      cancelText="Cancel"
      title="Generate Data from OCR"
      description="This will automatically extract and fill form data from the document image using OCR."
      centered
    />
  );
};
