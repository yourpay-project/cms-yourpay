import type { FC } from "react";

import { ImageViewerToolbar } from "@/shared/ui";

import type { KycDocumentImagesCompareItem } from "./KycDocumentImagesCompare.type";
import { KycDocumentImagesDraggableScrollViewport } from "./KycDocumentImagesDraggableScrollViewport";
import type { DocumentImagesDocKey } from "./KycDocumentImagesSinglePreview.type";
import { toDocumentImageHeightPercent } from "./document-images-transform-utils";

export interface KycDocumentImagesCompareCardProps {
  item: KycDocumentImagesCompareItem;
  onZoomIn: (docKey: DocumentImagesDocKey) => void;
  onZoomOut: (docKey: DocumentImagesDocKey) => void;
  onRotateRight: (docKey: DocumentImagesDocKey) => void;
  onRotateLeft: (docKey: DocumentImagesDocKey) => void;
  onReset: (docKey: DocumentImagesDocKey) => void;
}

/** One document panel used inside compare modal grid. */
export const KycDocumentImagesCompareCard: FC<KycDocumentImagesCompareCardProps> = ({
  item,
  onZoomIn,
  onZoomOut,
  onRotateRight,
  onRotateLeft,
  onReset,
}) => {
  const heightPercent = toDocumentImageHeightPercent(item.scale);
  let imageNode: React.ReactNode = (
    <div className="flex h-[18rem] items-center justify-center text-sm text-muted-foreground">
      Image unavailable
    </div>
  );
  if (item.imageUrl) {
    imageNode = (
      <img
        src={item.imageUrl}
        alt={item.title}
        className="mx-auto block h-auto max-w-none object-contain transition-transform duration-200"
        style={{
          height: `${heightPercent}%`,
          width: "auto",
          transform: `rotate(${item.rotation}deg)`,
          transformOrigin: "center center",
        }}
        draggable={false}
      />
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-foreground">{item.title}</div>
      <div className="relative h-[40vh] min-h-[18rem] overflow-hidden rounded-md border border-border bg-muted/20 p-2">
        <KycDocumentImagesDraggableScrollViewport scale={item.scale} className="h-full overflow-auto">
          {imageNode}
        </KycDocumentImagesDraggableScrollViewport>
        <ImageViewerToolbar
          title={item.title}
          onZoomIn={() => onZoomIn(item.docKey)}
          onZoomOut={() => onZoomOut(item.docKey)}
          onRotateRight={() => onRotateRight(item.docKey)}
          onRotateLeft={() => onRotateLeft(item.docKey)}
          onReset={() => onReset(item.docKey)}
        />
      </div>
    </div>
  );
};
