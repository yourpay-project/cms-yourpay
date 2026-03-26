import type { FC, ReactNode } from "react";

interface ModalHeaderSectionProps {
  title?: ReactNode;
  description?: ReactNode;
}

/**
 * Optional header section for modal title and description.
 *
 * @param props - {@link ModalHeaderSectionProps}
 * @returns Header block or null when title and description are both empty.
 */
export const ModalHeaderSection: FC<ModalHeaderSectionProps> = ({
  title,
  description,
}) => {
  if (title == null && description == null) {
    return null;
  }

  return (
    <div className="pt-5 px-6 pb-4">
      {title != null ? <h2 className="text-base font-semibold">{title}</h2> : null}
      {description != null ? (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
};

