import type { FC } from "react";
import { Columns2, FileSearch } from "lucide-react";
import { Button, Card } from "@/shared/ui";
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

  const {
    idScale,
    idRotation,
    selfieScale,
    selfieRotation,
    changeScale,
    rotate,
    reset,
  } = useDocumentImageTransforms();

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
      onReset: reset,
    });
  };

  return (
    <Card className="min-w-0 max-w-full overflow-x-hidden p-4">
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
              onReset: reset,
            })
          }
          disabled={!canCompare}
          aria-label="Compare ID and selfie image"
        >
          <Columns2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4">
        <DocThumb
          docKey="id"
          title="ID Document"
          uploadLabel={idDocumentUploadLabel}
          document={idDocument}
          canEdit={canEdit}
          onOpenModal={onOpenSinglePreview}
          onFilesSelected={onIdDocumentFilesSelected}
          scale={idScale}
          rotation={idRotation}
          onZoomIn={() => changeScale("id", 0.15)}
          onZoomOut={() => changeScale("id", -0.15)}
          onRotate={() => rotate("id")}
          onReset={() => reset("id")}
        />

        <DocThumb
          docKey="selfie"
          title="Selfie Photo"
          uploadLabel="Update Selfie Photo"
          document={selfieDocument}
          canEdit={canEdit}
          onOpenModal={onOpenSinglePreview}
          onFilesSelected={onSelfieFilesSelected}
          scale={selfieScale}
          rotation={selfieRotation}
          onZoomIn={() => changeScale("selfie", 0.15)}
          onZoomOut={() => changeScale("selfie", -0.15)}
          onRotate={() => rotate("selfie")}
          onReset={() => reset("selfie")}
        />
      </div>

      <div className="mt-4 space-y-2">
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

