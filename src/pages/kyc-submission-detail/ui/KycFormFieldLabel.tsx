import type { FC, ReactNode } from "react";

export interface KycFormFieldLabelProps {
  htmlFor?: string;
  children: ReactNode;
  trailing?: ReactNode;
}

/**
 * Label row for KYC form fields (label + optional trailing e.g. required hint).
 */
export const KycFormFieldLabel: FC<KycFormFieldLabelProps> = ({ htmlFor, children, trailing }) => (
  <div className="flex items-center justify-between gap-2">
    <label htmlFor={htmlFor} className="text-xs font-medium text-muted-foreground">
      {children}
    </label>
    {trailing}
  </div>
);
