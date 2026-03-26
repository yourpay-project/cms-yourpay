import type { FC, ReactNode } from "react";
import { Lock } from "lucide-react";

import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";

export interface KycLeftLockedCollapsibleProps {
  isLocked: boolean;
  onEnableEdit: () => void;
  children: ReactNode;
  className?: string;
}

/**
 * Single collapsible parent wrapper for all left-side cards.
 * The lock overlay is applied to the parent body (not each inner card).
 */
export const KycLeftLockedCollapsible: FC<KycLeftLockedCollapsibleProps> = ({
  isLocked,
  onEnableEdit,
  children,
  className,
}) => {
  let lockOverlayNode: ReactNode = null;
  if (isLocked) {
    lockOverlayNode = (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/35 px-6">
        <div className="flex flex-col items-center gap-4">
          <Lock className="h-6 w-6 text-white" />
          <Button onClick={onEnableEdit} type="button" className="h-9" variant="secondary">
            Enable Edit
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        {lockOverlayNode}

        {children}
      </div>
    </div>
  );
};

