import type { FC } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/shared/ui";
import { ImageViewerToolbar } from "@/shared/ui";

import type { KycDocumentImagesCompareProps, KycDocumentImagesCompareItem } from "./KycDocumentImagesCompare.type";
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

export const KycDocumentImagesCompare: FC<KycDocumentImagesCompareProps> = ({
  onClose,
  open,
  items,
  onChangeScale,
  onRotate,
  onRotateLeft,
  onReset,
}) => {
  const wasOpenRef = useRef(open);
  const [localItems, setLocalItems] = useState<KycDocumentImagesCompareItem[]>(items);

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      setLocalItems(items);
    }
    wasOpenRef.current = open;
  }, [items, open]);

  const onZoomIn = (docKey: DocumentImagesDocKey): void => {
    setLocalItems((prev) =>
      prev.map((it) => (it.docKey === docKey ? { ...it, scale: applyScaleDelta(it.scale, 0.15) } : it)),
    );
    onChangeScale(docKey, 0.15);
  };

  const onZoomOut = (docKey: DocumentImagesDocKey): void => {
    setLocalItems((prev) =>
      prev.map((it) => (it.docKey === docKey ? { ...it, scale: applyScaleDelta(it.scale, -0.15) } : it)),
    );
    onChangeScale(docKey, -0.15);
  };

  const onRotateLocal = (docKey: DocumentImagesDocKey): void => {
    setLocalItems((prev) =>
      prev.map((it) => (it.docKey === docKey ? { ...it, rotation: it.rotation + 90 } : it)),
    );
    onRotate(docKey);
  };

  const onRotateLeftLocal = (docKey: DocumentImagesDocKey): void => {
    setLocalItems((prev) =>
      prev.map((it) => (it.docKey === docKey ? { ...it, rotation: it.rotation - 90 } : it)),
    );
    onRotateLeft(docKey);
  };

  const onResetLocal = (docKey: DocumentImagesDocKey): void => {
    setLocalItems((prev) => prev.map((it) => (it.docKey === docKey ? { ...it, scale: 1, rotation: 0 } : it)));
    onReset(docKey);
  };

  const renderedItems = useMemo(() => localItems, [localItems]);

  return (
    <div className="-mx-6 -my-2 flex max-h-[85vh] flex-col">
      <div className="shrink-0 px-6 pb-4 pt-5">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground">Compare Documents</h3>
        </div>
      </div>

      <div className="flex-1 overflow-x-hidden overflow-y-auto px-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {renderedItems.map((item) => (
            <div key={item.docKey} className="space-y-2">
              <div className="text-sm font-medium text-foreground">{item.title}</div>

              <div className="relative h-[40vh] min-h-[18rem] overflow-hidden rounded-md border border-border bg-muted/20 p-2">
                <KycDocumentImagesDraggableScrollViewport scale={item.scale} className="h-full overflow-auto">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="mx-auto block h-auto max-w-none object-contain transition-transform duration-200"
                      style={{
                        height: `${Math.max(25, Math.round(item.scale * 100))}%`,
                        width: "auto",
                        transform: `rotate(${item.rotation}deg)`,
                        transformOrigin: "center center",
                      }}
                      draggable={false}
                    />
                  ) : (
                    <div className="flex h-[18rem] items-center justify-center text-sm text-muted-foreground">
                      Image unavailable
                    </div>
                  )}
                </KycDocumentImagesDraggableScrollViewport>

                <ImageViewerToolbar
                  title={item.title}
                  onZoomIn={() => onZoomIn(item.docKey)}
                  onZoomOut={() => onZoomOut(item.docKey)}
                  onRotateRight={() => onRotateLocal(item.docKey)}
                  onRotateLeft={() => onRotateLeftLocal(item.docKey)}
                  onReset={() => onResetLocal(item.docKey)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex shrink-0 justify-end px-6 pb-5 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

