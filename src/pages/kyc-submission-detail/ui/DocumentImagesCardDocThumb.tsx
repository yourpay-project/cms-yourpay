import type { ChangeEvent, FC, RefObject } from "react";

import type { KycDocumentImage } from "@/entities/kyc-submission";
import { FileDropzone, ImageViewerFrame, ImageViewerToolbar } from "@/shared/ui";

import type { DocKey } from "./document-images-card-utils";

export interface DocThumbProps {
  docKey: DocKey;
  title: string;
  document?: KycDocumentImage;
  uploadLabel: string;
  canEdit: boolean;
  onOpenModal: (docKey: DocKey) => void;
  onFilesSelected?: (files: File[]) => void;
  uploadInputId: string;
  uploadInputRef: RefObject<HTMLInputElement | null>;
  scale: number;
  rotation: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: () => void;
  onRotateLeft: () => void;
  onReset: () => void;
  onEdit?: () => void;
}

const DROPZONE_HINT = "Supported formats: JPG, JPEG, PNG, PDF. Max size: 10MB";

/**
 * Document thumbnail card with conditional upload/dropzone, preview actions, and viewer tools.
 */
export const DocThumb: FC<DocThumbProps> = ({
  docKey,
  title,
  document,
  uploadLabel,
  canEdit,
  onOpenModal,
  onFilesSelected,
  uploadInputId,
  uploadInputRef,
  scale,
  rotation,
  onZoomIn,
  onZoomOut,
  onRotate,
  onRotateLeft,
  onReset,
  onEdit,
}) => {
  const hasImage = Boolean(document?.imageUrl);
  const canShowEdit = canEdit && Boolean(onEdit);

  const onHiddenInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length > 0) onFilesSelected?.(files);
    event.target.value = "";
  };

  let contentNode: React.ReactNode = (
    <FileDropzone
      label={uploadLabel}
      description={DROPZONE_HINT}
      accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
      disabled={!canEdit}
      onFilesSelected={onFilesSelected}
    />
  );

  if (hasImage) {
    contentNode = (
      <>
        <div className="aspect-[4/3] w-full">
          <ImageViewerFrame
            src={document?.imageUrl}
            alt={title}
            onPreview={() => onOpenModal(docKey)}
            previewAriaLabel={`Open ${title} preview`}
            imageClassName="transition-transform duration-200"
            imageStyle={{ transform: `scale(${scale}) rotate(${rotation}deg)` }}
            toolbar={
              <div className="flex items-center gap-1 rounded-md border border-border/60 bg-background/90 p-1 shadow-sm backdrop-blur-sm">
                <ImageViewerToolbar
                  placement="inline"
                  title={title}
                  onZoomIn={onZoomIn}
                  onZoomOut={onZoomOut}
                  onRotateRight={onRotate}
                  onRotateLeft={onRotateLeft}
                  onReset={onReset}
                  onEdit={canShowEdit ? onEdit : undefined}
                />
              </div>
            }
            toolbarPlacement="bottom-center"
          />
        </div>

        <input
          ref={uploadInputRef}
          type="file"
          id={uploadInputId}
          name={`document_images_card_upload_${docKey}`}
          className="sr-only"
          accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
          onChange={onHiddenInputChange}
          aria-label={`Upload ${title}`}
        />
      </>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-foreground">{title}</div>
      {contentNode}
    </div>
  );
};

