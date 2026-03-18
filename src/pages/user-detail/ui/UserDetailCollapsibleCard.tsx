import type { FC, ReactNode } from "react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";

interface UserDetailCollapsibleCardProps {
  title: string;
  defaultOpen?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  children: ReactNode;
}

/**
 * Clickable collapsible card used across customer detail sections.
 *
 * @param props - Card title, state defaults, and content.
 * @returns Collapsible card with keyboard-accessible header.
 */
export const UserDetailCollapsibleCard: FC<UserDetailCollapsibleCardProps> = ({
  title,
  defaultOpen = true,
  className,
  headerClassName,
  contentClassName,
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
    <Card className={className}>
      <CardHeader
        className={cn(
          "flex cursor-pointer select-none flex-row items-center justify-between space-y-0 rounded-t-lg py-4",
          headerClassName
        )}
        role="button"
        tabIndex={0}
        onClick={toggleOpen}
        onKeyDown={onHeaderKeyDown}
        aria-expanded={open}
        aria-label={open ? `Collapse ${title}` : `Expand ${title}`}
      >
        <CardTitle className="text-base">{title}</CardTitle>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
      </CardHeader>
      {open ? <CardContent className={contentClassName}>{children}</CardContent> : null}
    </Card>
  );
};
