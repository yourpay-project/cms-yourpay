import type { FC } from "react";
import { CircleHelp } from "lucide-react";

/**
 * The "Transaction ID" table header with copy affordance tooltip.
 *
 * @returns Transaction ID column header node.
 */
export const TransactionIdHeader: FC = () => {
  return (
    <span className="inline-flex items-center gap-1">
      <span>Transaction ID</span>
      <span className="group/tooltip relative inline-flex" aria-label="Double click a Transaction ID to copy">
        <CircleHelp className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
        <span className="pointer-events-none absolute left-1/2 top-[calc(100%+6px)] z-30 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-xs font-normal text-popover-foreground opacity-0 shadow-md transition-opacity duration-150 group-hover/tooltip:opacity-100">
          Double click a Transaction ID to copy
        </span>
      </span>
    </span>
  );
};

