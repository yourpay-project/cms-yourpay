import type { FC } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/shared/ui";
import { ImageViewerToolbar } from "@/shared/ui";

import type { KycDocumentImagesSinglePreviewProps } from "./KycDocumentImagesSinglePreview.type";
import { KycDocumentImagesDraggableScrollViewport } from "./KycDocumentImagesDraggableScrollViewport";
import type { DocumentImagesDocKey } from "./KycDocumentImagesSinglePreview.type";
import {
  applyDocumentImageScaleDelta,
  toDocumentImageHeightPercent,
} from "./document-images-transform-utils";

export const KycDocumentImagesSinglePreview: FC<KycDocumentImagesSinglePreviewProps> = ({
  onClose,
  open,
  activeDocKey,
  activeTitle,
  activeDocument,
  activeScale,
  activeRotation,
  onChangeScale,
  onRotate,
  onRotateLeft,
  onReset,
}) => {
  const wasOpenRef = useRef(open);

  const [scale, setScale] = useState(activeScale);
  const [rotation, setRotation] = useState(activeRotation);

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      setScale(activeScale);
      setRotation(activeRotation);
    }
    wasOpenRef.current = open;
  }, [activeRotation, activeScale, open]);

  const zoomIn = (docKey: DocumentImagesDocKey): void => {
    setScale((prev) => applyDocumentImageScaleDelta(prev, 0.15));
    onChangeScale(docKey, 0.15);
  };

  const zoomOut = (docKey: DocumentImagesDocKey): void => {
    setScale((prev) => applyDocumentImageScaleDelta(prev, -0.15));
    onChangeScale(docKey, -0.15);
  };

  const rotate = (docKey: DocumentImagesDocKey): void => {
    setRotation((prev) => prev + 90);
    onRotate(docKey);
  };

  const rotateLeft = (docKey: DocumentImagesDocKey): void => {
    setRotation((prev) => prev - 90);
    onRotateLeft(docKey);
  };

  const reset = (docKey: DocumentImagesDocKey): void => {
    setScale(1);
    setRotation(0);
    onReset(docKey);
  };

  // Normal view should stretch by height; zoom expands layout inside the scroll viewport.
  const heightPercent = useMemo(() => toDocumentImageHeightPercent(scale), [scale]);
  const imageNode = activeDocument?.imageUrl ? (
    <img
      src={activeDocument.imageUrl}
      alt={activeTitle}
      className="mx-auto block h-auto max-w-none object-contain transition-transform duration-200"
      style={{
        height: `${heightPercent}%`,
        width: "auto",
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "center center",
      }}
      draggable={false}
    />
  ) : (
    <div className="flex h-[40vh] items-center justify-center text-sm text-muted-foreground">
      Image unavailable
    </div>
  );

  return (
    <div className="-mx-6 -my-2 flex max-h-[85vh] flex-col overflow-y-auto overflow-x-hidden">
      <div className="space-y-4">
        <div className="px-6 pt-5">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">{activeTitle}</h3>
          </div>
        </div>

        <div className="px-6">
          <div className="relative h-[60vh] min-h-[40vh] overflow-hidden rounded-md border border-border bg-muted/20 p-3">
            <KycDocumentImagesDraggableScrollViewport scale={scale} className="h-full overflow-auto">
              {imageNode}
            </KycDocumentImagesDraggableScrollViewport>

            <ImageViewerToolbar
              title={activeTitle}
              onZoomIn={() => zoomIn(activeDocKey)}
              onZoomOut={() => zoomOut(activeDocKey)}
              onRotateRight={() => rotate(activeDocKey)}
              onRotateLeft={() => rotateLeft(activeDocKey)}
              onReset={() => reset(activeDocKey)}
            />
          </div>
        </div>

        <div className="flex justify-end px-6 pb-5 pt-0">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

