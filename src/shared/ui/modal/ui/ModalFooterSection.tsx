import type { FC, ReactNode } from "react";
import { ModalFooter } from "./ModalFooter";

interface ModalFooterSectionProps {
  footer?: ReactNode | null;
  okText?: string;
  cancelText?: string;
  confirmLoading?: boolean;
  onCancel?: () => void;
  onOk?: () => void;
}

/**
 * Footer section renderer for modal.
 *
 * @param props - {@link ModalFooterSectionProps}
 * @returns Default footer, custom footer, or null.
 */
export const ModalFooterSection: FC<ModalFooterSectionProps> = ({
  footer,
  okText,
  cancelText,
  confirmLoading,
  onCancel,
  onOk,
}) => {
  const handleCancel = onCancel ?? (() => {});

  if (footer === null) {
    return null;
  }

  if (footer !== undefined) {
    return <div className="px-6 pb-5 pt-4">{footer}</div>;
  }

  return (
    <ModalFooter
      okText={okText}
      cancelText={cancelText}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      onOk={onOk}
    />
  );
};

