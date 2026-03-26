import type { CSSProperties, FC, ReactNode } from "react";

import { cn } from "@/shared/lib/utils";
import { ImageWithLoader } from "./image-with-loader";

export interface ImageViewerFrameProps {
  src?: string;
  alt: string;
  /** Enables the click-to-preview overlay button. */
  onPreview?: () => void;
  /** Used for accessibility label on the overlay trigger. */
  previewAriaLabel?: string;
  /** When true, shows a subtle hover overlay on md+ screens. */
  hoverOverlay?: boolean;
  /** Floating toolbar node rendered over the image. */
  toolbar?: ReactNode;
  /** Position of the toolbar inside the frame. */
  toolbarPlacement?: "bottom-left" | "bottom-center";
  /** Optional content layered above the image (e.g., edit button). */
  overlay?: ReactNode;
  /** Frame container className. */
  className?: string;
  /** Image className. */
  imageClassName?: string;
  /** Inline styles applied to the image element (e.g., rotate/scale). */
  imageStyle?: CSSProperties;
}

/**
 * Generic image preview frame: consistent border, optional click-to-preview overlay,
 * optional hover overlay, and optional toolbar/overlay slots.
 *
 * @param props - {@link ImageViewerFrameProps}
 * @returns Reusable image preview frame.
 */
export const ImageViewerFrame: FC<ImageViewerFrameProps> = ({
  src,
  alt,
  onPreview,
  previewAriaLabel,
  hoverOverlay = true,
  toolbar,
  toolbarPlacement = "bottom-left",
  overlay,
  className,
  imageClassName,
  imageStyle,
}) => {
  const hasPreview = Boolean(onPreview);

  return (
    <div
      className={cn(
        "group relative h-full w-full overflow-hidden rounded-md border border-border bg-muted/30",
        className,
      )}
    >
      {hasPreview ? (
        <button
          type="button"
          className="absolute inset-0 z-10 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
          onClick={onPreview}
          aria-label={previewAriaLabel ?? `Open ${alt} preview`}
        />
      ) : null}

      <ImageWithLoader
        src={src}
        alt={alt}
        className={cn("h-full w-full object-contain", imageClassName)}
        style={imageStyle}
      />

      {hoverOverlay ? (
        <div className="pointer-events-none absolute inset-0 bg-black/20 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100" />
      ) : null}

      {toolbar ? (
        <div
          className={cn(
            "absolute bottom-3 z-20",
            toolbarPlacement === "bottom-center"
              ? "left-1/2 -translate-x-1/2"
              : "left-3",
          )}
        >
          {toolbar}
        </div>
      ) : null}
      {overlay ? <div className="absolute inset-0 z-20">{overlay}</div> : null}
    </div>
  );
};

