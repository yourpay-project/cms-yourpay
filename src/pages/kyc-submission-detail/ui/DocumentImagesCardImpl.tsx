import type { FC } from "react";
import { useRef } from "react";
import { Card } from "@/shared/ui";
import { useModalStore } from "@/widgets/modal-manager";

import type { DocKey } from "./document-images-card-utils";
import type { DocumentImagesCardProps } from "./DocumentImagesCardImpl.type";
import { useDocumentImageTransforms, useDocumentImagesCardCompareItems } from "./document-images-card-hooks";
import { DocumentImagesCardHeader } from "./DocumentImagesCardHeader";
import { DocumentImagesCardBody } from "./DocumentImagesCardBody";
import { DocumentImagesCardFooter } from "./DocumentImagesCardFooter";

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

  const scrollRef = useRef<HTMLDivElement | null>(null);

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
      <DocumentImagesCardHeader
        canCompare={canCompare}
        onCompare={() =>
          openModal("KYC_DOCUMENT_IMAGES_COMPARE_MODAL", {
            items: compareItems,
            onChangeScale: changeScale,
            onRotate: rotate,
            onRotateLeft: rotateLeft,
            onReset: reset,
          })
        }
      />

      <DocumentImagesCardBody
        scrollRef={scrollRef}
        idUploadInputRef={idUploadInputRef}
        selfieUploadInputRef={selfieUploadInputRef}
        idDocument={idDocument}
        selfieDocument={selfieDocument}
        idDocumentUploadLabel={idDocumentUploadLabel}
        canEdit={canEdit}
        idScale={idScale}
        idRotation={idRotation}
        selfieScale={selfieScale}
        selfieRotation={selfieRotation}
        onOpenSinglePreview={onOpenSinglePreview}
        onIdDocumentFilesSelected={onIdDocumentFilesSelected}
        onSelfieFilesSelected={onSelfieFilesSelected}
        onZoomIn={(docKey) => changeScale(docKey, 0.15)}
        onZoomOut={(docKey) => changeScale(docKey, -0.15)}
        onRotateRight={(docKey) => rotate(docKey)}
        onRotateLeft={(docKey) => rotateLeft(docKey)}
        onReset={(docKey) => reset(docKey)}
        onEditId={canEdit ? () => idUploadInputRef.current?.click() : undefined}
        onEditSelfie={canEdit ? () => selfieUploadInputRef.current?.click() : undefined}
      />

      <DocumentImagesCardFooter
        canCheckProgress={canCheckProgress}
        onOpenProgress={() => openModal("KYC_DOCUMENT_IMAGES_PROGRESS_MODAL")}
      />
    </Card>
  );
};

