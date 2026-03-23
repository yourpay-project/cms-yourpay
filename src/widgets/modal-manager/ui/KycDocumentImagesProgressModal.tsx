import type { FC } from "react";

import { Button } from "@/shared/ui";

import type { KycDocumentImagesProgressModalProps } from "./KycDocumentImagesProgressModal.type";

/**
 * Placeholder modal for document progress details.
 */
export const KycDocumentImagesProgressModal: FC<KycDocumentImagesProgressModalProps> = ({
  onClose,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-1 pb-1">
        <h3 className="text-base font-semibold text-foreground">Document Progress</h3>
        <p className="text-sm text-muted-foreground">View current processing progress information.</p>
      </div>

      <p className="text-sm text-muted-foreground">Document progress details will be shown here.</p>

      <div className="flex justify-end pb-5 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

