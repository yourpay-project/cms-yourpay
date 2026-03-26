import type { FC } from "react";
import { X } from "lucide-react";

interface ModalCloseButtonProps {
  onCancel: () => void;
}

/**
 * Close button for {@link Modal} content.
 *
 * @param props - {@link ModalCloseButtonProps}
 * @returns Close button element.
 */
export const ModalCloseButton: FC<ModalCloseButtonProps> = ({ onCancel }) => {
  return (
    <button
      type="button"
      onClick={onCancel}
      className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="Close"
    >
      <X className="h-4 w-4" />
    </button>
  );
};

