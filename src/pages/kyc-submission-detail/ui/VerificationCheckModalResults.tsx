import type { FC } from "react";

import { VerificationCheckModalCheckItem } from "./VerificationCheckModalCheckItem";

import type { VerificationCheckModalResultsProps } from "./VerificationCheckModalResults.type";

/**
 * Renders the results list for `VerificationCheckModal`.
 */
export const VerificationCheckModalResults: FC<VerificationCheckModalResultsProps> = ({ checkItems }) => {
  if (checkItems.length === 0) {
    return (
      <div>
        <div className="mb-2 text-sm font-semibold text-foreground">Check results</div>
        <div className="rounded-lg border border-dashed border-border bg-muted/15 px-4 py-6 text-center text-sm text-muted-foreground">
          No verification details available yet.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2 text-sm font-semibold text-foreground">Check results</div>
      <ul className="space-y-2">
        {checkItems.map((item) => (
          <li key={item.key}>
            <VerificationCheckModalCheckItem
              label={item.label}
              status={item.status}
              score={item.score}
              failedReason={item.failedReason}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

