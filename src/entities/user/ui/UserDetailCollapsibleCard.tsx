import type { FC, ReactNode } from "react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";

interface UserDetailCollapsibleCardProps {
  title: ReactNode;
  ariaTitle?: string;
  defaultOpen?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  style?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  children: ReactNode;
}

/**
 * Collapsible card used in Customer Detail and related modals.
 *
 * @param props - Card title, open state, and content.
 * @returns Collapsible card with accessible header toggle.
 */
export const UserDetailCollapsibleCard: FC<UserDetailCollapsibleCardProps> = ({
  title,
  ariaTitle,
  defaultOpen = true,
  className,
  headerClassName,
  contentClassName,
  style,
  headerStyle,
  children,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const toggleOpen = () => setOpen((prev) => !prev);

  const onHeaderKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleOpen();
    }
  };

  return (
    <Card className={className} style={style}>
      <CardHeader
        className={cn(
          "flex cursor-pointer select-none flex-row items-center justify-between space-y-0 rounded-t-lg py-4",
          headerClassName
        )}
        style={headerStyle}
        role="button"
        tabIndex={0}
        onClick={toggleOpen}
        onKeyDown={onHeaderKeyDown}
        aria-expanded={open}
        aria-label={open ? `Collapse ${ariaTitle ?? "section"}` : `Expand ${ariaTitle ?? "section"}`}
      >
        <CardTitle className="text-base">{title}</CardTitle>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
      </CardHeader>
      {open ? <CardContent className={contentClassName}>{children}</CardContent> : null}
    </Card>
  );
};
