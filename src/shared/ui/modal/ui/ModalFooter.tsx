import * as React from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/shared/ui/button";

export interface ModalFooterProps {
  /**
   * Text for the primary action button.
   */
  okText?: string;
  /**
   * Text for the secondary (cancel) button.
   */
  cancelText?: string;
  /**
   * Whether the primary action is in a loading state.
   */
  confirmLoading?: boolean;
  /**
   * Called when the secondary (cancel) button is clicked.
   */
  onCancel?: () => void;
  /**
   * Called when the primary (ok) button is clicked.
   */
  onOk?: () => void;
}

/**
 * Renders the default Ant Design–style footer for {@link Modal}.
 *
 * @param props {@link ModalFooterProps} configuring labels, loading state, and callbacks.
 * @returns JSX element with Cancel and OK buttons.
 */
export const ModalFooter: React.FC<ModalFooterProps> = ({
  okText = "OK",
  cancelText = "Cancel",
  confirmLoading,
  onCancel,
  onOk,
}) => {
  return (
    <div className="flex items-center justify-end gap-2 border-t border-border/60 bg-muted/40 px-6 pb-5 pt-4">
      <Button variant="outline" onClick={onCancel}>
        {cancelText}
      </Button>
      <Button onClick={onOk} disabled={confirmLoading}>
        {confirmLoading && <Loader2 className="animate-spin" />}
        {okText}
      </Button>
    </div>
  );
};

