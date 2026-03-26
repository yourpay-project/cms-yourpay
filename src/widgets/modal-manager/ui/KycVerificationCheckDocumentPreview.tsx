import type { FC, ReactNode } from "react";

import { Card, CardContent } from "@/shared/ui";

export interface KycVerificationCheckDocumentPreviewProps {
  title: string;
  imageUrl?: string;
  imageAlt: string;
  emptyState?: ReactNode;
}

/**
 * Small preview card for document images in `KycVerificationCheck`.
 *
 * @param props - {@link KycVerificationCheckDocumentPreviewProps}
 * @returns Card with image preview or empty state.
 */
export const KycVerificationCheckDocumentPreview: FC<KycVerificationCheckDocumentPreviewProps> = ({
  title,
  imageUrl,
  imageAlt,
  emptyState,
}) => {
  let body: ReactNode = emptyState ?? (
    <div className="flex h-full min-h-[140px] items-center justify-center text-sm text-muted-foreground">
      No image
    </div>
  );

  if (imageUrl) {
    body = (
      <img
        src={imageUrl}
        alt={imageAlt}
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <Card className="overflow-hidden border-border/80">
      <CardContent className="p-4">
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <div className="mt-3 aspect-[4/3] overflow-hidden rounded-lg border border-border/60 bg-muted/30">
          {body}
        </div>
      </CardContent>
    </Card>
  );
};

