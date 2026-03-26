import type { FC } from "react";

import { ImageViewerToolbar } from "@/shared/ui";

import { KycDocumentImagesDraggableScrollViewport } from "./KycDocumentImagesDraggableScrollViewport";
import type { DocumentImagesDocKey } from "./KycDocumentImagesSinglePreview.type";

interface SinglePreviewImageContentProps {
  imageUrl?: string;
  title: string;
  heightPercent: number;
  rotation: number;
}

interface SinglePreviewViewportProps {
  title: string;
  imageUrl?: string;
  scale: number;
  rotation: number;
  heightPercent: number;
  docKey: DocumentImagesDocKey;
  onZoomIn: (docKey: DocumentImagesDocKey) => void;
  onZoomOut: (docKey: DocumentImagesDocKey) => void;
  onRotateRight: (docKey: DocumentImagesDocKey) => void;
  onRotateLeft: (docKey: DocumentImagesDocKey) => void;
  onReset: (docKey: DocumentImagesDocKey) => void;
}

const SinglePreviewImageContent: FC<SinglePreviewImageContentProps> = ({
  imageUrl,
  title,
  heightPercent,
  rotation,
}) => {
  if (!imageUrl) {
    return (
      <div className="flex h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Image unavailable
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={title}
      className="mx-auto block h-auto max-w-none object-contain transition-transform duration-200"
      style={{
        height: `${heightPercent}%`,
        width: "auto",
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "center center",
      }}
      draggable={false}
    />
  );
};

/**
 * Scrollable single-image preview viewport with transform toolbar.
 *
 * @param props View model and image transform handlers.
 * @returns Single preview image area.
 */
export const SinglePreviewViewport: FC<SinglePreviewViewportProps> = ({
  title,
  imageUrl,
  scale,
  rotation,
  heightPercent,
  docKey,
  onZoomIn,
  onZoomOut,
  onRotateRight,
  onRotateLeft,
  onReset,
}) => {
  return (
    <div className="px-6">
      <div className="relative h-[60vh] min-h-[40vh] overflow-hidden rounded-md border border-border bg-muted/20 p-3">
        <KycDocumentImagesDraggableScrollViewport scale={scale} className="h-full overflow-auto">
          <SinglePreviewImageContent
            imageUrl={imageUrl}
            title={title}
            heightPercent={heightPercent}
            rotation={rotation}
          />
        </KycDocumentImagesDraggableScrollViewport>

        <ImageViewerToolbar
          title={title}
          onZoomIn={() => onZoomIn(docKey)}
          onZoomOut={() => onZoomOut(docKey)}
          onRotateRight={() => onRotateRight(docKey)}
          onRotateLeft={() => onRotateLeft(docKey)}
          onReset={() => onReset(docKey)}
        />
      </div>
    </div>
  );
};
