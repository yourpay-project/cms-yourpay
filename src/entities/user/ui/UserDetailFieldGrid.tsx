import type { FC } from "react";
import type { ReactNode } from "react";

export interface UserDetailFieldItem {
  label: string;
  value?: ReactNode;
}

interface UserDetailFieldGridProps {
  items: UserDetailFieldItem[];
}

const FALLBACK_VALUE = "-";

export const UserDetailFieldGrid: FC<UserDetailFieldGridProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="rounded-md border border-border/70 bg-muted/20 px-3 py-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{item.label}</p>
          <div className="mt-1 break-words text-sm text-foreground">
            {typeof item.value === "string" ? item.value.trim() || FALLBACK_VALUE : (item.value ?? FALLBACK_VALUE)}
          </div>
        </div>
      ))}
    </div>
  );
};
