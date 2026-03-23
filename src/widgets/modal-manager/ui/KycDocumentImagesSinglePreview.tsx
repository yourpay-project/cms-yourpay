import type { FC } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { House, RotateCw, ZoomIn, ZoomOut } from "lucide-react";

import { Button } from "@/shared/ui";

import type { KycDocumentImagesSinglePreviewProps } from "./KycDocumentImagesSinglePreview.type";
import { KycDocumentImagesDraggableScrollViewport } from "./KycDocumentImagesDraggableScrollViewport";
import type { DocumentImagesDocKey } from "./KycDocumentImagesSinglePreview.type";

const DOCUMENT_IMAGE_SCALE_MIN = 0.5;
const DOCUMENT_IMAGE_SCALE_MAX = 3;

function clampScale(value: number, min: number = DOCUMENT_IMAGE_SCALE_MIN, max: number = DOCUMENT_IMAGE_SCALE_MAX): number {
  return Math.max(min, Math.min(max, value));
}

function applyScaleDelta(prev: number, delta: number): number {
  const next = Number((prev + delta).toFixed(2));
  return clampScale(next);
}

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
    setScale((prev) => applyScaleDelta(prev, 0.15));
    onChangeScale(docKey, 0.15);
  };

  const zoomOut = (docKey: DocumentImagesDocKey): void => {
    setScale((prev) => applyScaleDelta(prev, -0.15));
    onChangeScale(docKey, -0.15);
  };

  const rotate = (docKey: DocumentImagesDocKey): void => {
    setRotation((prev) => prev + 90);
    onRotate(docKey);
  };

  const reset = (docKey: DocumentImagesDocKey): void => {
    setScale(1);
    setRotation(0);
    onReset(docKey);
  };

  // Normal view should stretch by height; zoom expands layout inside the scroll viewport.
  const heightPercent = useMemo(() => Math.max(25, Math.round(scale * 100)), [scale]);

  return (
    <div className="-mx-6 -my-2">
      <div className="space-y-4">
        <div className="px-6 pt-5">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">{activeTitle}</h3>
            <p className="text-sm text-muted-foreground">Use zoom/rotate to inspect the document image.</p>
          </div>
        </div>

        <div className="px-6">
          <div className="relative h-[60vh] min-h-[40vh] overflow-hidden rounded-md border border-border bg-muted/20 p-3">
            <KycDocumentImagesDraggableScrollViewport scale={scale} className="h-full overflow-auto">
              {activeDocument?.imageUrl ? (
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
              )}
            </KycDocumentImagesDraggableScrollViewport>

            <div className="pointer-events-none absolute bottom-3 left-3 z-10">
              <div
                className="pointer-events-auto flex items-center gap-1 rounded-md border border-border/60 bg-background/90 p-1 shadow-sm backdrop-blur-sm"
                data-no-drag="true"
              >
                <button
                  type="button"
                  className="rounded p-2 text-foreground transition-colors hover:bg-muted"
                  onClick={() => zoomIn(activeDocKey)}
                  aria-label="Zoom in"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="rounded p-2 text-foreground transition-colors hover:bg-muted"
                  onClick={() => zoomOut(activeDocKey)}
                  aria-label="Zoom out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="rounded p-2 text-foreground transition-colors hover:bg-muted"
                  onClick={() => rotate(activeDocKey)}
                  aria-label="Rotate"
                >
                  <RotateCw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="rounded p-2 text-foreground transition-colors hover:bg-muted"
                  onClick={() => reset(activeDocKey)}
                  aria-label="Reset"
                >
                  <House className="h-4 w-4" />
                </button>
              </div>
            </div>
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

