import type { FC } from "react";
import { Modal } from "@/shared/ui/modal";

import type { KycEnableEditConfirmModalProps } from "./types";

/**
 * Confirmation modal for enabling KYC editing mode.
 */
export const KycEnableEditConfirmModal: FC<KycEnableEditConfirmModalProps> = ({ onClose, onConfirm }) => {
  return (
    <Modal
      open
      onCancel={onClose}
      onOk={() => {
        onConfirm?.();
        onClose();
      }}
      okText="Yes, Enable Editing"
      cancelText="Cancel"
      title="Update User Data"
      description="Are you sure you want to enable editing mode to update this user's KYC documents?"
      centered
    />
  );
};
