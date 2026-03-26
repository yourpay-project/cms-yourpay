import type { FC } from "react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/shared/ui";
import type { KycDocumentImagesCompareProps, KycDocumentImagesCompareItem } from "./KycDocumentImagesCompare.type";
import { KycDocumentImagesCompareCard } from "./KycDocumentImagesCompareCard";
import type { DocumentImagesDocKey } from "./KycDocumentImagesSinglePreview.type";
import { applyDocumentImageScaleDelta } from "./document-images-transform-utils";

/** Compare view for transformed KYC document images. */
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
      prev.map((it) =>
        it.docKey === docKey
          ? { ...it, scale: applyDocumentImageScaleDelta(it.scale, 0.15) }
          : it
      ),
    );
    onChangeScale(docKey, 0.15);
  };

  const onZoomOut = (docKey: DocumentImagesDocKey): void => {
    setLocalItems((prev) =>
      prev.map((it) =>
        it.docKey === docKey
          ? { ...it, scale: applyDocumentImageScaleDelta(it.scale, -0.15) }
          : it
      ),
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

  return (
    <div className="-mx-6 -my-2 flex max-h-[85vh] flex-col">
      <div className="shrink-0 px-6 pb-4 pt-5">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground">Compare Documents</h3>
        </div>
      </div>

      <div className="flex-1 overflow-x-hidden overflow-y-auto px-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {localItems.map((item) => (
            <KycDocumentImagesCompareCard
              key={item.docKey}
              item={item}
              onZoomIn={onZoomIn}
              onZoomOut={onZoomOut}
              onRotateRight={onRotateLocal}
              onRotateLeft={onRotateLeftLocal}
              onReset={onResetLocal}
            />
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

