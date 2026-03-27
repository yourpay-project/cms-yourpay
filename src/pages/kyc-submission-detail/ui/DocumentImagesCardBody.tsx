import type { FC, RefObject } from "react";
import type { KycDocumentImage } from "@/entities/kyc-submission";
import { useScrollShadow } from "@/shared/ui";
import { cn } from "@/shared/lib";

import { DocThumb } from "./DocumentImagesCardDocThumb";
import type { DocKey } from "./document-images-card-utils";

export interface DocumentImagesCardBodyProps {
  scrollRef: RefObject<HTMLDivElement | null>;
  idUploadInputRef: RefObject<HTMLInputElement | null>;
  selfieUploadInputRef: RefObject<HTMLInputElement | null>;
  idDocument?: KycDocumentImage;
  selfieDocument?: KycDocumentImage;
  idDocumentUploadLabel: string;
  canEdit: boolean;
  idScale: number;
  idRotation: number;
  selfieScale: number;
  selfieRotation: number;
  onOpenSinglePreview: (docKey: DocKey) => void;
  onIdDocumentFilesSelected?: (files: File[]) => void;
  onSelfieFilesSelected?: (files: File[]) => void;
  onZoomIn: (docKey: DocKey) => void;
  onZoomOut: (docKey: DocKey) => void;
  onRotateRight: (docKey: DocKey) => void;
  onRotateLeft: (docKey: DocKey) => void;
  onReset: (docKey: DocKey) => void;
  onEditId?: () => void;
  onEditSelfie?: () => void;
}

/**
 * Document Images card scrollable body: thumbnails + scroll shadows.
 *
 * @param props - {@link DocumentImagesCardBodyProps}
 * @returns Scrollable body section for Document Images card.
 */
export const DocumentImagesCardBody: FC<DocumentImagesCardBodyProps> = ({
  scrollRef,
  idUploadInputRef,
  selfieUploadInputRef,
  idDocument,
  selfieDocument,
  idDocumentUploadLabel,
  canEdit,
  idScale,
  idRotation,
  selfieScale,
  selfieRotation,
  onOpenSinglePreview,
  onIdDocumentFilesSelected,
  onSelfieFilesSelected,
  onZoomIn,
  onZoomOut,
  onRotateRight,
  onRotateLeft,
  onReset,
  onEditId,
  onEditSelfie,
}) => {
  const shadow = useScrollShadow(scrollRef);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        className={cn(
          "pointer-events-none absolute left-0 right-0 top-0 z-10 h-4 bg-gradient-to-b from-background/80 to-transparent transition-opacity",
          shadow.showTop ? "opacity-100" : "opacity-0"
        )}
      />

      <div
        ref={scrollRef}
        className="h-full overflow-x-hidden overflow-y-auto px-4 pb-5 pt-2"
      >
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
            onZoomIn={() => onZoomIn("id")}
            onZoomOut={() => onZoomOut("id")}
            onRotate={() => onRotateRight("id")}
            onRotateLeft={() => onRotateLeft("id")}
            onReset={() => onReset("id")}
            onEdit={canEdit ? onEditId : undefined}
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
            onZoomIn={() => onZoomIn("selfie")}
            onZoomOut={() => onZoomOut("selfie")}
            onRotate={() => onRotateRight("selfie")}
            onRotateLeft={() => onRotateLeft("selfie")}
            onReset={() => onReset("selfie")}
            onEdit={canEdit ? onEditSelfie : undefined}
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
  );
};

