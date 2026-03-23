import type { FC } from "react";

import { Card, CardContent } from "@/shared/ui";

import type { VerificationCheckModalDocumentPreviewCardProps } from "./VerificationCheckModalDocumentPreviewCard.type";

/**
 * Renders a single document preview card for `VerificationCheckModal`.
 */
export const VerificationCheckModalDocumentPreviewCard: FC<VerificationCheckModalDocumentPreviewCardProps> = ({
  title,
  image,
  emptyText,
}) => {
  return (
    <Card className="overflow-hidden border-border/80">
      <CardContent className="p-4">
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <div className="mt-3 aspect-[4/3] overflow-hidden rounded-lg border border-border/60 bg-muted/30">
          {image?.imageUrl ? (
            <img src={image.imageUrl} alt={`${title} Preview`} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full min-h-[140px] items-center justify-center text-sm text-muted-foreground">
              {emptyText}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

