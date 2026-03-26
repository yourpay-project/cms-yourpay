import type { FC } from "react";
import { Columns2 } from "lucide-react";
import { Button } from "@/shared/ui";

export interface DocumentImagesCardHeaderProps {
  canCompare: boolean;
  onCompare: () => void;
}

/**
 * Document Images card header: title + compare action.
 *
 * @param props - {@link DocumentImagesCardHeaderProps}
 * @returns Header section for Document Images card.
 */
export const DocumentImagesCardHeader: FC<DocumentImagesCardHeaderProps> = ({
  canCompare,
  onCompare,
}) => {
  return (
    <div className="shrink-0 p-4 pb-2">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-medium text-foreground">Document Images</div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onCompare}
          disabled={!canCompare}
          aria-label="Compare ID and selfie image"
        >
          <Columns2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

