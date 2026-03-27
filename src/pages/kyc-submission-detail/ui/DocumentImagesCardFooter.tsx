import type { FC } from "react";
import { FileSearch } from "lucide-react";
import { Button } from "@/shared/ui";

export interface DocumentImagesCardFooterProps {
  canCheckProgress: boolean;
  onOpenProgress: () => void;
}

/**
 * Document Images card footer: progress CTA button.
 *
 * @param props - {@link DocumentImagesCardFooterProps}
 * @returns Footer section for Document Images card.
 */
export const DocumentImagesCardFooter: FC<DocumentImagesCardFooterProps> = ({
  canCheckProgress,
  onOpenProgress,
}) => {
  return (
    <div className="shrink-0 p-4 pt-2">
      <Button
        onClick={onOpenProgress}
        disabled={!canCheckProgress}
        className="h-9 w-full gap-2"
        variant="default"
      >
        <FileSearch className="h-4 w-4" aria-hidden />
        Check document progress
      </Button>
    </div>
  );
};

