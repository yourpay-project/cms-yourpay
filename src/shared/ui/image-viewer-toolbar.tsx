import type { FC } from "react";
import { House, Pencil, RotateCcw, RotateCw, ZoomIn, ZoomOut } from "lucide-react";

export interface ImageViewerToolbarProps {
  /** Used for accessibility labels (e.g. "Rotate ID Document"). */
  title: string;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotateRight: () => void;
  onRotateLeft: () => void;
  onReset: () => void;
  /** Optional edit callback. If provided, the edit button is shown. */
  onEdit?: () => void;
  /** Render as floating (absolute) or inline row. */
  placement?: "floating" | "inline";
  /** Override container positioning/classes when using floating placement. */
  containerClassName?: string;
}

/**
 * Floating image viewer toolbar (zoom/rotate/reset/edit).
 *
 * @param props - {@link ImageViewerToolbarProps}
 * @returns Floating toolbar suitable for any image preview container.
 */
export const ImageViewerToolbar: FC<ImageViewerToolbarProps> = ({
  title,
  onZoomIn,
  onZoomOut,
  onRotateRight,
  onRotateLeft,
  onReset,
  onEdit,
  placement = "floating",
  containerClassName,
}) => {
  const buttons = (
    <>
      <button
        type="button"
        className="rounded p-2 text-foreground transition-colors hover:bg-muted"
        onClick={onZoomIn}
        aria-label={`Zoom in ${title}`}
      >
        <ZoomIn className="h-4 w-4" />
      </button>
      <button
        type="button"
        className="rounded p-2 text-foreground transition-colors hover:bg-muted"
        onClick={onZoomOut}
        aria-label={`Zoom out ${title}`}
      >
        <ZoomOut className="h-4 w-4" />
      </button>
      <button
        type="button"
        className="rounded p-2 text-foreground transition-colors hover:bg-muted"
        onClick={onRotateRight}
        aria-label={`Rotate ${title}`}
      >
        <RotateCw className="h-4 w-4" />
      </button>
      <button
        type="button"
        className="rounded p-2 text-foreground transition-colors hover:bg-muted"
        onClick={onRotateLeft}
        aria-label={`Rotate left ${title}`}
      >
        <RotateCcw className="h-4 w-4" />
      </button>
      <button
        type="button"
        className="rounded p-2 text-foreground transition-colors hover:bg-muted"
        onClick={onReset}
        aria-label={`Reset ${title}`}
      >
        <House className="h-4 w-4" />
      </button>
      {onEdit && (
        <button
          type="button"
          className="rounded p-2 text-foreground transition-colors hover:bg-muted"
          onClick={onEdit}
          aria-label={`Edit ${title}`}
        >
          <Pencil className="h-4 w-4" />
        </button>
      )}
    </>
  );

  if (placement === "inline") {
    return <>{buttons}</>;
  }

  return (
    <div className={containerClassName ?? "pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2"}>
      <div
        className="pointer-events-auto flex items-center gap-1 rounded-md border border-border/60 bg-background/90 p-1 shadow-sm backdrop-blur-sm"
        data-no-drag="true"
      >
        {buttons}
      </div>
    </div>
  );
};

