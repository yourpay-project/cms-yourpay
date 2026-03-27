import type { FC } from "react";

import { Button } from "@/shared/ui";

interface SinglePreviewFooterProps {
  onClose: () => void;
}

/**
 * Footer actions for single image preview modal.
 *
 * @param props Close action handler.
 * @returns Right-aligned footer action row.
 */
export const SinglePreviewFooter: FC<SinglePreviewFooterProps> = ({ onClose }) => {
  return (
    <div className="flex justify-end px-6 pb-5 pt-0">
      <Button type="button" variant="outline" onClick={onClose}>
        Close
      </Button>
    </div>
  );
};
