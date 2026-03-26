/* eslint-disable max-lines */
import type { FC } from "react";
import { useRef } from "react";
import { Columns2, FileSearch } from "lucide-react";
import { Button, Card, useScrollShadow } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { useModalStore } from "@/widgets/modal-manager";

import { DocThumb } from "./DocumentImagesCardDocThumb";
import type { DocKey } from "./document-images-card-utils";
import type { DocumentImagesCardProps } from "./DocumentImagesCardImpl.type";
import { useDocumentImageTransforms, useDocumentImagesCardCompareItems } from "./document-images-card-hooks";

export const DocumentImagesCard: FC<DocumentImagesCardProps> = ({
  idDocument,
  selfieDocument,
  canCheckProgress,
  idDocumentUploadLabel = "Update ID Document Photo",
  onIdDocumentFilesSelected,
  onSelfieFilesSelected,
  uploadsDisabled = false,
}) => {
  const openModal = useModalStore().open;
  const idUploadInputRef = useRef<HTMLInputElement | null>(null);
  const selfieUploadInputRef = useRef<HTMLInputElement | null>(null);

  const {
    idScale,
    idRotation,
    selfieScale,
    selfieRotation,
    changeScale,
    rotate,
    rotateLeft,
    reset,
  } = useDocumentImageTransforms();

  const scrollRef = useRef<HTMLDivElement>(null);
  const shadow = useScrollShadow(scrollRef);

  const canCompare = Boolean(idDocument?.imageUrl && selfieDocument?.imageUrl);
  const canEdit = !uploadsDisabled;

  const compareItems = useDocumentImagesCardCompareItems({
    idDocument,
    selfieDocument,
    idScale,
    idRotation,
    selfieScale,
    selfieRotation,
  });

  const onOpenSinglePreview = (docKey: DocKey): void => {
    const activeDocument = docKey === "id" ? idDocument : selfieDocument;
    const activeTitle = docKey === "id" ? "ID Document" : "Selfie Photo";
    const activeScale = docKey === "id" ? idScale : selfieScale;
    const activeRotation = docKey === "id" ? idRotation : selfieRotation;

    openModal("KYC_DOCUMENT_IMAGES_SINGLE_PREVIEW_MODAL", {
      activeDocKey: docKey,
      activeTitle,
      activeDocument,
      activeScale,
      activeRotation,
      onChangeScale: changeScale,
      onRotate: rotate,
      onRotateLeft: rotateLeft,
      onReset: reset,
    });
  };

  return (
    <Card className="flex min-w-0 max-w-full flex-col overflow-hidden xl:min-h-0 xl:h-full">
      <div className="shrink-0 p-4 pb-2">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-medium text-foreground">Document Images</div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() =>
              openModal("KYC_DOCUMENT_IMAGES_COMPARE_MODAL", {
                items: compareItems,
                onChangeScale: changeScale,
                onRotate: rotate,
                onRotateLeft: rotateLeft,
                onReset: reset,
              })
            }
            disabled={!canCompare}
            aria-label="Compare ID and selfie image"
          >
            <Columns2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col">
        <div
          className={cn(
            "pointer-events-none absolute left-0 right-0 top-0 z-10 h-4 bg-gradient-to-b from-background/80 to-transparent transition-opacity",
            shadow.showTop ? "opacity-100" : "opacity-0"
          )}
        />

        <div ref={scrollRef} className="h-full overflow-x-hidden overflow-y-auto px-4 pb-5 pt-2">
          <div className="grid grid-cols-1 gap-4">
            <DocThumb
              docKey="id"
              title="ID Document"
              uploadLabel={idDocumentUploadLabel}
              document={idDocument}
              canEdit={canEdit}
              onOpenModal={onOpenSinglePreview}
              onFilesSelected={onIdDocumentFilesSelected}
              uploadInputId="document-images-card-file-input-id"
              uploadInputRef={idUploadInputRef}
              scale={idScale}
              rotation={idRotation}
              onZoomIn={() => changeScale("id", 0.15)}
              onZoomOut={() => changeScale("id", -0.15)}
              onRotate={() => rotate("id")}
              onRotateLeft={() => rotateLeft("id")}
              onReset={() => reset("id")}
              onEdit={canEdit ? () => idUploadInputRef.current?.click() : undefined}
            />

            <DocThumb
              docKey="selfie"
              title="Selfie Photo"
              uploadLabel="Update Selfie Photo"
              document={selfieDocument}
              canEdit={canEdit}
              onOpenModal={onOpenSinglePreview}
              onFilesSelected={onSelfieFilesSelected}
              uploadInputId="document-images-card-file-input-selfie"
              uploadInputRef={selfieUploadInputRef}
              scale={selfieScale}
              rotation={selfieRotation}
              onZoomIn={() => changeScale("selfie", 0.15)}
              onZoomOut={() => changeScale("selfie", -0.15)}
              onRotate={() => rotate("selfie")}
              onRotateLeft={() => rotateLeft("selfie")}
              onReset={() => reset("selfie")}
              onEdit={canEdit ? () => selfieUploadInputRef.current?.click() : undefined}
            />
          </div>
        </div>

        <div
          className={cn(
            "pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-4 bg-gradient-to-t from-background/80 to-transparent transition-opacity",
            shadow.showBottom ? "opacity-100" : "opacity-0"
          )}
        />
      </div>

      <div className="shrink-0 p-4 pt-2">
        <Button
          onClick={() => openModal("KYC_DOCUMENT_IMAGES_PROGRESS_MODAL")}
          disabled={!canCheckProgress}
          className="h-9 w-full gap-2"
          variant="default"
        >
          <FileSearch className="h-4 w-4" aria-hidden />
          Check document progress
        </Button>
      </div>
    </Card>
  );
};

