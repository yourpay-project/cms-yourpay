import type { ChangeEvent, FC } from "react";
import { useMemo, useRef, useState } from "react";
import {
  Columns2,
  FileSearch,
  House,
  Pencil,
  RotateCw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import type { KycDocumentImage } from "@/entities/kyc-submission";
import {
  Button,
  Card,
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  FileDropzone,
} from "@/shared/ui";
import { cn } from "@/shared/lib/utils";
import type { PointerEvent as ReactPointerEvent } from "react";

interface ImageOffset {
  x: number;
  y: number;
}

interface PannableImageProps {
  imageUrl: string;
  title: string;
  scale: number;
  rotation: number;
  offset: ImageOffset;
  onOffsetChange: (next: ImageOffset) => void;
  className?: string;
  imageClassName?: string;
}

const PannableImage: FC<PannableImageProps> = ({
  imageUrl,
  title,
  scale,
  rotation,
  offset,
  onOffsetChange,
  className,
  imageClassName,
}) => {
  const dragStateRef = useRef<{
    pointerId: number | null;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  }>({
    pointerId: null,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  });
  const [isDragging, setIsDragging] = useState(false);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (scale <= 1) return;
    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: offset.x,
      originY: offset.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragStateRef.current.pointerId !== event.pointerId) return;
    event.preventDefault();
    const nextX = dragStateRef.current.originX + (event.clientX - dragStateRef.current.startX);
    const nextY = dragStateRef.current.originY + (event.clientY - dragStateRef.current.startY);
    onOffsetChange({ x: nextX, y: nextY });
  };

  const onPointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragStateRef.current.pointerId !== event.pointerId) return;
    dragStateRef.current.pointerId = null;
    setIsDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 w-full min-w-0 items-center justify-center overflow-hidden",
        scale > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default",
        className,
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      style={{ touchAction: scale > 1 ? "none" : "auto" }}
    >
      <img
        src={imageUrl}
        alt={title}
        className={cn("mx-auto h-full w-auto max-w-full object-contain transition-transform duration-150", imageClassName)}
        style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale}) rotate(${rotation}deg)` }}
        draggable={false}
      />
    </div>
  );
};

export interface DocumentImagesCardProps {
  idDocument?: KycDocumentImage;
  selfieDocument?: KycDocumentImage;
  canCheckProgress: boolean;
  /** Label for the ID document upload zone (e.g. KTP for Indonesia) */
  idDocumentUploadLabel?: string;
  onIdDocumentFilesSelected?: (files: File[]) => void;
  onSelfieFilesSelected?: (files: File[]) => void;
  uploadsDisabled?: boolean;
}

interface DocThumbProps {
  docKey: "id" | "selfie";
  title: string;
  document?: KycDocumentImage;
  uploadLabel: string;
  canEdit: boolean;
  onOpenModal: (docKey: "id" | "selfie") => void;
  onFilesSelected?: (files: File[]) => void;
  scale: number;
  rotation: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: () => void;
  onReset: () => void;
}

const DocThumb: FC<DocThumbProps> = ({
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

const DROPZONE_HINT = "Supported formats: JPG, JPEG, PNG, PDF. Max size: 10MB";

/**
 * Document preview card with conditional upload/dropzone, viewer tools, and compare modal.
 *
 * @param props - {@link DocumentImagesCardProps}
 * @returns Interactive document image section for KYC submission detail
 */
export const DocumentImagesCard: FC<DocumentImagesCardProps> = ({
  idDocument,
  selfieDocument,
  canCheckProgress,
  idDocumentUploadLabel = "Update ID Document Photo",
  onIdDocumentFilesSelected,
  onSelfieFilesSelected,
  uploadsDisabled = false,
}) => {
  const [singlePreviewOpen, setSinglePreviewOpen] = useState(false);
  const [comparePreviewOpen, setComparePreviewOpen] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [activeDocKey, setActiveDocKey] = useState<"id" | "selfie">("id");

  const [idScale, setIdScale] = useState(1);
  const [idRotation, setIdRotation] = useState(0);
  const [selfieScale, setSelfieScale] = useState(1);
  const [selfieRotation, setSelfieRotation] = useState(0);
  const [idOffset, setIdOffset] = useState<ImageOffset>({ x: 0, y: 0 });
  const [selfieOffset, setSelfieOffset] = useState<ImageOffset>({ x: 0, y: 0 });

  const canCompare = Boolean(idDocument?.imageUrl && selfieDocument?.imageUrl);
  const canEdit = !uploadsDisabled;

  const activeDocument = activeDocKey === "id" ? idDocument : selfieDocument;
  const activeTitle = activeDocKey === "id" ? "ID Document" : "Selfie Photo";
  const activeScale = activeDocKey === "id" ? idScale : selfieScale;
  const activeRotation = activeDocKey === "id" ? idRotation : selfieRotation;
  const activeOffset = activeDocKey === "id" ? idOffset : selfieOffset;

  const changeScale = (docKey: "id" | "selfie", delta: number) => {
    if (docKey === "id") {
      setIdScale((prev) => Math.max(0.5, Math.min(3, Number((prev + delta).toFixed(2)))));
      return;
    }
    setSelfieScale((prev) => Math.max(0.5, Math.min(3, Number((prev + delta).toFixed(2)))));
  };

  const rotate = (docKey: "id" | "selfie") => {
    if (docKey === "id") {
      setIdRotation((prev) => prev + 90);
      return;
    }
    setSelfieRotation((prev) => prev + 90);
  };

  const reset = (docKey: "id" | "selfie") => {
    if (docKey === "id") {
      setIdScale(1);
      setIdRotation(0);
      setIdOffset({ x: 0, y: 0 });
      return;
    }
    setSelfieScale(1);
    setSelfieRotation(0);
    setSelfieOffset({ x: 0, y: 0 });
  };

  const setOffset = (docKey: "id" | "selfie", next: ImageOffset) => {
    if (docKey === "id") {
      setIdOffset(next);
      return;
    }
    setSelfieOffset(next);
  };

  const onOpenSinglePreview = (docKey: "id" | "selfie") => {
    setActiveDocKey(docKey);
    setSinglePreviewOpen(true);
  };

  const compareItems = useMemo(
    () => [
      {
        docKey: "id" as const,
        title: "ID Document",
        imageUrl: idDocument?.imageUrl,
        scale: idScale,
        rotation: idRotation,
        offset: idOffset,
      },
      {
        docKey: "selfie" as const,
        title: "Selfie Photo",
        imageUrl: selfieDocument?.imageUrl,
        scale: selfieScale,
        rotation: selfieRotation,
        offset: selfieOffset,
      },
    ],
    [idDocument?.imageUrl, idOffset, idRotation, idScale, selfieDocument?.imageUrl, selfieOffset, selfieRotation, selfieScale],
  );

  return (
    <Card className="min-w-0 max-w-full overflow-x-hidden p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-medium text-foreground">Document Images</div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setComparePreviewOpen(true)}
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
          onClick={() => setIsProgressModalOpen(true)}
          disabled={!canCheckProgress}
          className="h-9 w-full gap-2"
          variant="default"
        >
          <FileSearch className="h-4 w-4" aria-hidden />
          Check document progress
        </Button>
      </div>

      <Dialog open={singlePreviewOpen} onOpenChange={setSinglePreviewOpen}>
        <DialogContent className="max-h-[90vh] w-[min(96vw,960px)] max-w-[96vw] overflow-hidden p-4 sm:p-6">
          <DialogHeader className="space-y-1">
            <DialogTitle>{activeTitle}</DialogTitle>
          </DialogHeader>
          <div className="relative max-h-[60vh] min-h-[40vh] overflow-hidden rounded-md border border-border bg-muted/20 p-3">
            {activeDocument?.imageUrl ? (
              <PannableImage
                imageUrl={activeDocument.imageUrl}
                title={activeTitle}
                scale={activeScale}
                rotation={activeRotation}
                offset={activeOffset}
                onOffsetChange={(next) => setOffset(activeDocKey, next)}
                imageClassName="max-h-[56vh]"
              />
            ) : (
              <div className="flex h-[40vh] items-center justify-center text-sm text-muted-foreground">Image unavailable</div>
            )}
            <div className="absolute bottom-3 left-3 z-10">
              <div className="flex items-center gap-1 rounded-md border border-border/60 bg-background/90 p-1 shadow-sm backdrop-blur-sm">
                <button
                  type="button"
                  className="rounded p-2 text-foreground transition-colors hover:bg-muted"
                  onClick={() => changeScale(activeDocKey, 0.15)}
                  aria-label="Zoom in"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="rounded p-2 text-foreground transition-colors hover:bg-muted"
                  onClick={() => changeScale(activeDocKey, -0.15)}
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
          <div className="flex justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={comparePreviewOpen} onOpenChange={setComparePreviewOpen}>
        <DialogContent className="max-h-[92vh] w-[min(96vw,1200px)] max-w-[96vw] overflow-hidden p-4 sm:p-6">
          <DialogHeader className="space-y-1">
            <DialogTitle>Compare Documents</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {compareItems.map((item) => (
              <div key={item.docKey} className="space-y-2">
                <div className="text-sm font-medium text-foreground">{item.title}</div>
                <div className="relative max-h-[40vh] min-h-[18rem] overflow-hidden rounded-md border border-border bg-muted/20 p-2">
                  {item.imageUrl ? (
                    <PannableImage
                      imageUrl={item.imageUrl}
                      title={item.title}
                      scale={item.scale}
                      rotation={item.rotation}
                      offset={item.offset}
                      onOffsetChange={(next) => setOffset(item.docKey, next)}
                      imageClassName="max-h-[36vh]"
                    />
                  ) : (
                    <div className="flex h-[18rem] items-center justify-center text-sm text-muted-foreground">
                      Image unavailable
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 z-10">
                    <div className="flex items-center gap-1 rounded-md border border-border/60 bg-background/90 p-1 shadow-sm backdrop-blur-sm">
                      <button
                        type="button"
                        className="rounded p-2 text-foreground transition-colors hover:bg-muted"
                        onClick={() => changeScale(item.docKey, 0.15)}
                        aria-label={`Zoom in ${item.title}`}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="rounded p-2 text-foreground transition-colors hover:bg-muted"
                        onClick={() => changeScale(item.docKey, -0.15)}
                        aria-label={`Zoom out ${item.title}`}
                      >
                        <ZoomOut className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="rounded p-2 text-foreground transition-colors hover:bg-muted"
                        onClick={() => rotate(item.docKey)}
                        aria-label={`Rotate ${item.title}`}
                      >
                        <RotateCw className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="rounded p-2 text-foreground transition-colors hover:bg-muted"
                        onClick={() => reset(item.docKey)}
                        aria-label={`Reset ${item.title}`}
                      >
                        <House className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isProgressModalOpen} onOpenChange={setIsProgressModalOpen}>
        <DialogContent className="w-[min(92vw,640px)] max-w-[92vw]">
          <DialogHeader>
            <DialogTitle>Check Documents Progress</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Document progress details will be shown here.
          </p>
          <div className="flex justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
