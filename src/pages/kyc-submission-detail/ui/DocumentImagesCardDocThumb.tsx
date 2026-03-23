import type { ChangeEvent, FC } from "react";
import { useRef } from "react";
import { House, Pencil, RotateCw, ZoomIn, ZoomOut } from "lucide-react";

import type { KycDocumentImage } from "@/entities/kyc-submission";
import { FileDropzone } from "@/shared/ui";

import type { DocKey } from "./document-images-card-utils";

export interface DocThumbProps {
  docKey: DocKey;
  title: string;
  document?: KycDocumentImage;
  uploadLabel: string;
  canEdit: boolean;
  onOpenModal: (docKey: DocKey) => void;
  onFilesSelected?: (files: File[]) => void;
  scale: number;
  rotation: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: () => void;
  onReset: () => void;
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
  scale,
  rotation,
  onZoomIn,
  onZoomOut,
  onRotate,
  onReset,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasImage = Boolean(document?.imageUrl);

  const onHiddenInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length > 0) onFilesSelected?.(files);
    event.target.value = "";
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-foreground">{title}</div>
      {hasImage ? (
        <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-md border border-border bg-muted/30">
          <button
            type="button"
            className="absolute inset-0 z-10 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
            onClick={() => onOpenModal(docKey)}
            aria-label={`Open ${title} preview`}
          />
          <img
            src={document?.imageUrl}
            alt={title}
            className="h-full w-full object-contain transition-transform duration-200"
            style={{ transform: `scale(${scale}) rotate(${rotation}deg)` }}
          />

          <div className="pointer-events-none absolute inset-0 bg-black/20 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100" />
          <div className="absolute bottom-3 left-3 z-20">
            <div className="flex items-center gap-1 rounded-md border border-border/60 bg-background/90 p-1 shadow-sm backdrop-blur-sm">
              <button
                type="button"
                className="pointer-events-auto rounded p-1 text-foreground transition-colors hover:bg-muted"
                onClick={onZoomIn}
                aria-label={`Zoom in ${title}`}
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="pointer-events-auto rounded p-1 text-foreground transition-colors hover:bg-muted"
                onClick={onZoomOut}
                aria-label={`Zoom out ${title}`}
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="pointer-events-auto rounded p-1 text-foreground transition-colors hover:bg-muted"
                onClick={onRotate}
                aria-label={`Rotate ${title}`}
              >
                <RotateCw className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="pointer-events-auto rounded p-1 text-foreground transition-colors hover:bg-muted"
                onClick={onReset}
                aria-label={`Reset ${title}`}
              >
                <House className="h-4 w-4" />
              </button>
              {canEdit ? (
                <button
                  type="button"
                  className="pointer-events-auto rounded p-1 text-foreground transition-colors hover:bg-muted"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label={`Update ${title}`}
                >
                  <Pencil className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            className="sr-only"
            accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
            onChange={onHiddenInputChange}
          />
        </div>
      ) : (
        <FileDropzone
          label={uploadLabel}
          description={DROPZONE_HINT}
          accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
          disabled={!canEdit}
          onFilesSelected={onFilesSelected}
        />
      )}
    </div>
  );
};

