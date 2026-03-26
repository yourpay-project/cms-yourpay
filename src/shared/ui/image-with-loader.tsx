import * as React from "react";

import { cn } from "@/shared/lib/utils";
import { Skeleton } from "./skeleton";

export interface ImageWithLoaderProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "onLoad" | "onError"> {
  containerClassName?: string;
  skeletonClassName?: string;
}

/**
 * Image wrapper that shows a skeleton until the image is loaded.
 *
 * @param props - {@link ImageWithLoaderProps}
 * @returns Image with a loading skeleton and error fallback.
 */
export const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({
  containerClassName,
  skeletonClassName,
  className,
  src,
  alt,
  ...imgProps
}) => {
  const [loaded, setLoaded] = React.useState(false);
  const [errored, setErrored] = React.useState(false);

  React.useEffect(() => {
    setLoaded(false);
    setErrored(false);
  }, [src]);

  return (
    <div className={cn("relative h-full w-full", containerClassName)}>
      {!loaded && !errored ? (
        <Skeleton className={cn("absolute inset-0", skeletonClassName)} />
      ) : null}
      {errored ? (
        <div className="absolute inset-0 flex items-center justify-center rounded-md bg-muted/30 text-xs text-muted-foreground">
          Failed to load image
        </div>
      ) : null}
      <img
        {...imgProps}
        src={src}
        alt={alt}
        className={cn("h-full w-full", !loaded && "opacity-0", className)}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
      />
    </div>
  );
};

