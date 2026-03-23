import type { FC } from "react";
import { Button, Card } from "@/shared/ui";
import { Lock } from "lucide-react";

import type { KycDocumentImage } from "@/entities/kyc-submission";

export interface LockedDocumentCardProps {
  document: KycDocumentImage;
  onEdit: () => void;
}

/**
 * Document image card displayed on the left side.
 * Shows an always-on lock overlay to indicate the document is not editable directly yet.
 */
export const LockedDocumentCard: FC<LockedDocumentCardProps> = ({ document, onEdit }) => {
  const label = document.label ?? document.type ?? "Document";

  return (
    <Card className="overflow-hidden p-3">
      <div className="relative w-full overflow-hidden rounded-md bg-muted/40">
        <div className="aspect-[4/3] w-full">
          {document.imageUrl ? (
            <img
              src={document.imageUrl}
              alt={label}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}
        </div>

        <div className="absolute inset-0 flex items-center justify-center bg-black/55">
          <div className="flex flex-col items-center gap-3">
            <Lock className="h-6 w-6 text-white" />
            <Button onClick={onEdit} variant="secondary">
              Edit Document
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-3 text-center text-sm font-medium">{label}</div>
    </Card>
  );
};

