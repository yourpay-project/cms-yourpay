import type { ChangeEvent, DragEvent, FC } from "react";
import { useId, useRef, useState } from "react";

import { cn } from "@/shared/lib/utils";

export interface FileDropzoneProps {
  /** Title shown above the dashed region */
  label: string;
  /** Shown below the drop area (e.g. formats and size limits) */
  description?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  /** Called with chosen files (drop or browse) */
  onFilesSelected?: (files: File[]) => void;
  className?: string;
}

/**
 * Generic drag-and-drop file target styled with design tokens (`border-dashed`, `bg-muted/20`).
 * Uses a native `<input type="file" />` (hidden); Radix does not provide a file primitive.
 *
 * @param props - {@link FileDropzoneProps}
 * @returns Labeled drop region with Browse link
 */
export const FileDropzone: FC<FileDropzoneProps> = ({
  label,
  description,
  accept,
  multiple = false,
  disabled = false,
  onFilesSelected,
  className,
}) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const emitFiles = (list: FileList | null) => {
    if (!list?.length || disabled) return;
    const files = Array.from(list);
    onFilesSelected?.(files);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    emitFiles(e.target.files);
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    emitFiles(e.dataTransfer.files);
  };

  return (
    <div className={cn("flex min-w-0 max-w-full flex-col gap-2", className)}>
      <span className="text-sm font-medium text-foreground">{label}</span>
      <label
        htmlFor={inputId}
        className={cn(
          "flex min-h-[7.5rem] w-full min-w-0 max-w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-4 py-6 text-center transition-colors",
          isDragging && "border-primary bg-muted/40",
          disabled && "cursor-not-allowed opacity-60",
        )}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          className="sr-only"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={onInputChange}
        />
        <p className="text-sm text-muted-foreground">
          Drag & Drop your files or{" "}
          <span className="text-primary underline underline-offset-2">Browse</span>
        </p>
      </label>
      {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
    </div>
  );
};
