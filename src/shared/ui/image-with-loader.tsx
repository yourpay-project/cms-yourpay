import * as React from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/shared/lib/utils";

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

  let skeletonNode: React.ReactNode = null;
  if (!loaded && !errored) {
    skeletonNode = (
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center rounded-md bg-muted/20",
          skeletonClassName,
        )}
      >
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-hidden />
      </div>
    );
  }

  let errorNode: React.ReactNode = null;
  if (errored) {
    errorNode = (
      <div className="absolute inset-0 flex items-center justify-center rounded-md bg-muted/30 text-xs text-muted-foreground">
        Failed to load image
      </div>
    );
  }

  const opacityClassName = loaded ? "" : "opacity-0";

  return (
    <div className={cn("relative h-full w-full", containerClassName)}>
      {skeletonNode}
      {errorNode}
      <img
        {...imgProps}
        src={src}
        alt={alt}
        className={cn(
          "h-full w-full transition-opacity duration-200",
          opacityClassName,
          className,
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
      />
    </div>
  );
};

