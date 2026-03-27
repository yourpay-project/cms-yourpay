import type { FC } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import type { KycDocumentImagesSinglePreviewProps } from "./KycDocumentImagesSinglePreview.type";
import type { DocumentImagesDocKey } from "./KycDocumentImagesSinglePreview.type";
import {
  applyDocumentImageScaleDelta,
  toDocumentImageHeightPercent,
} from "./document-images-transform-utils";
import { SinglePreviewViewport } from "./SinglePreviewViewport";
import { SinglePreviewFooter } from "./SinglePreviewFooter";

/**
 * Single-document enlarged preview with local zoom/rotate controls.
 *
 * @param props Active document state and transform handlers.
 * @returns Single preview modal content.
 */
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
  const imageUrl = activeDocument?.imageUrl;

  return (
    <div className="-mx-6 -my-2 flex max-h-[85vh] flex-col overflow-y-auto overflow-x-hidden">
      <div className="space-y-4">
        <div className="px-6 pt-5">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">{activeTitle}</h3>
          </div>
        </div>

        <SinglePreviewViewport
          title={activeTitle}
          imageUrl={imageUrl}
          scale={scale}
          rotation={rotation}
          heightPercent={heightPercent}
          docKey={activeDocKey}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onRotateRight={rotate}
          onRotateLeft={rotateLeft}
          onReset={reset}
        />

        <SinglePreviewFooter onClose={onClose} />
      </div>
    </div>
  );
};

